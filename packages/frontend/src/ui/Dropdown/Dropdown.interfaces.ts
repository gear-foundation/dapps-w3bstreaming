interface DropdownMenu {
  [key: string]: DropdownMenuItem;
}

export interface DropdownMenuItem {
  label: string;
  value: string;
}

export interface DropdownProps {
  label: string;
  menu: DropdownMenu;
  activeValue: string;
  onItemClick: (item: DropdownMenuItem) => void;
}
