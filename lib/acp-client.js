// acp-client.js - OpenCode Agent Client Protocol (ACP) Implementation using JSON-RPC 2.0

class OpenCodeACPClient {
  constructor() {
    this.processSessionId = null;
    this.opencodeSessionId = null;
    this.messageId = 0;
    this.responseCallbacks = new Map();
    this.notificationHandlers = new Map();
    this.isInitialized = false;
  }

  async connect(projectDir = './') {
    try {
      // Start OpenCode ACP process in the background
      const result = await exec({
        command: "opencode acp",
        background: true,
        workdir: projectDir
      });
      
      this.processSessionId = result.sessionId;
      console.log(`Started OpenCode ACP process with sessionId: ${this.processSessionId}`);
      
      // Wait a bit for the process to start
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Initialize the connection
      await this.initialize();
      
      return this;
    } catch (error) {
      console.error('Failed to connect to OpenCode ACP:', error);
      throw error;
    }
  }

  async initialize() {
    const initializeRequest = {
      jsonrpc: "2.0",
      id: this.messageId++,
      method: "initialize",
      params: {
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: true,
            writeTextFile: true
          },
          terminal: true
        },
        clientInfo: {
          name: "clawdbot",
          title: "Clawdbot",
          version: "1.0.0"
        }
      }
    };

    // Send the initialize message
    await process({
      action: "write",
      sessionId: this.processSessionId,
      data: JSON.stringify(initializeRequest) + "\n"
    });

    // Poll for the response
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds with 2-second intervals
    
    while (attempts < maxAttempts) {
      const response = await process({
        action: "poll",
        sessionId: this.processSessionId
      });
      
      if (response && response.output) {
        const lines = response.output.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.id === initializeRequest.id) {
              if (parsed.error) {
                throw new Error(`Initialization failed: ${parsed.error.message}`);
              } else {
                this.isInitialized = true;
                console.log('OpenCode ACP initialized successfully:', parsed.result);
                return parsed.result;
              }
            }
          } catch (e) {
            // Skip non-JSON lines
            continue;
          }
        }
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls
    }
    
    throw new Error('Timeout waiting for initialize response');
  }

  async createSession(cwd, mcpServers = []) {
    if (!this.isInitialized) {
      throw new Error('Must initialize ACP client first');
    }

    const sessionRequest = {
      jsonrpc: "2.0",
      id: this.messageId++,
      method: "session/new",
      params: {
        cwd,
        mcpServers
      }
    };

    // Send the session creation message
    await process({
      action: "write",
      sessionId: this.processSessionId,
      data: JSON.stringify(sessionRequest) + "\n"
    });

    // Poll for the response
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds with 2-second intervals
    
    while (attempts < maxAttempts) {
      const response = await process({
        action: "poll",
        sessionId: this.processSessionId
      });
      
      if (response && response.output) {
        const lines = response.output.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.id === sessionRequest.id) {
              if (parsed.error) {
                throw new Error(`Session creation failed: ${parsed.error.message}`);
              } else {
                this.opencodeSessionId = parsed.result.sessionId;
                console.log('OpenCode session created:', this.opencodeSessionId);
                return parsed.result;
              }
            }
          } catch (e) {
            // Skip non-JSON lines
            continue;
          }
        }
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls
    }
    
    throw new Error('Timeout waiting for session creation response');
  }

  async sendPrompt(promptText) {
    if (!this.opencodeSessionId) {
      throw new Error('Must create a session first');
    }

    const promptRequest = {
      jsonrpc: "2.0",
      id: this.messageId++,
      method: "session/prompt",
      params: {
        sessionId: this.opencodeSessionId,
        prompt: [{
          type: "text",
          text: promptText
        }]
      }
    };

    // Send the prompt message
    await process({
      action: "write",
      sessionId: this.processSessionId,
      data: JSON.stringify(promptRequest) + "\n"
    });

    // Poll for responses until we get the final response with stopReason
    let fullResponse = '';
    let hasReceivedFinalResponse = false;
    let attempts = 0;
    const maxAttempts = 150; // 5 minutes with 2-second intervals
    
    while (!hasReceivedFinalResponse && attempts < maxAttempts) {
      const response = await process({
        action: "poll",
        sessionId: this.processSessionId
      });
      
      if (response && response.output) {
        const lines = response.output.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            
            // Handle session update notifications (streaming content)
            if (parsed.method === 'session/update' && 
                parsed.params.sessionId === this.opencodeSessionId) {
              if (parsed.params.content) {
                fullResponse += parsed.params.content;
              }
            }
            // Handle the final response
            else if (parsed.id === promptRequest.id) {
              if (parsed.result && parsed.result.stopReason) {
                hasReceivedFinalResponse = true;
                console.log('Prompt completed with stop reason:', parsed.result.stopReason);
              }
              if (parsed.error) {
                throw new Error(`Prompt failed: ${parsed.error.message}`);
              }
            }
          } catch (e) {
            // Skip non-JSON lines
            continue;
          }
        }
      }
      
      if (!hasReceivedFinalResponse) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls
      }
    }
    
    if (!hasReceivedFinalResponse) {
      throw new Error('Timeout waiting for prompt response');
    }
    
    return fullResponse;
  }

  async analyzeAndModifyProject(projectDir) {
    console.log(`Analyzing stock-tracker project in: ${projectDir}`);

    // First create a session
    await this.createSession(projectDir);

    // Analyze the current structure
    const analysisPrompt = `
      Analyze the stock-tracker project structure. Focus on:
      1. The current UI components (page.tsx, StockTable.tsx)
      2. The data structures used
      3. The overall architecture
      4. Identify areas for improvement in UI design, search functionality, and table interactivity
    `;
    
    const analysisResult = await this.sendPrompt(analysisPrompt);
    console.log('Analysis completed');
    
    // Now ask for optimization suggestions
    const optimizationPrompt = `
      Based on the analysis, provide specific code modifications to:
      1. Implement search functionality in the UI
      2. Enhance table interactivity (sorting, filtering, better display)
      3. Improve the overall UI design with modern patterns
      4. Add more financial indicators to the table
      5. Include specific code implementations for these improvements
    `;
    
    const optimizationResult = await this.sendPrompt(optimizationPrompt);
    console.log('Optimization suggestions received');
    
    // Apply optimizations by generating new files
    const implementationPrompt = `
      Generate the actual implementation code for:
      1. An enhanced page component with search functionality
      2. An improved stock table component with better interactivity
      3. Updated type definitions if needed
      4. Any additional components needed for the enhanced UI
      Make sure to maintain compatibility with existing functionality while adding new features.
    `;
    
    const implementationResult = await this.sendPrompt(implementationPrompt);
    console.log('Implementation code generated');
    
    return {
      analysis: analysisResult,
      optimizations: optimizationResult,
      implementation: implementationResult
    };
  }

  async disconnect() {
    if (this.processSessionId) {
      try {
        await process({
          action: "kill",
          sessionId: this.processSessionId
        });
        console.log('OpenCode ACP disconnected');
      } catch (error) {
        console.error('Error killing OpenCode ACP process:', error);
      }
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OpenCodeACPClient;
} else if (typeof window !== 'undefined') {
  window.OpenCodeACPClient = OpenCodeACPClient;
}