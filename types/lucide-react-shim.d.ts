// 全局类型声明，用于解决lucide-react图标导入问题
import { LucideIcon } from 'lucide-react';

// 定义所有可能用到的图标类型
declare module 'lucide-react' {
  export const RefreshCw: LucideIcon;
  export const Search: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const TrendingDown: LucideIcon;
  export const DollarSign: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Filter: LucideIcon;
  export const SortAsc: LucideIcon;
  export const SortDesc: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const Calculator: LucideIcon;
  export const Scale: LucideIcon;
  export const Building: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Eye: LucideIcon;
  export const Star: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Check: LucideIcon;
}