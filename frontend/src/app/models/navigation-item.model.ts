export interface NavigationItem {
  label: string;
  icon: string;
  route?: string;
  disabled?: boolean;
  children?: NavigationItem[];
}
