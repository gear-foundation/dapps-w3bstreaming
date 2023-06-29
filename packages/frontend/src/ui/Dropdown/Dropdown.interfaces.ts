export interface DropdownProps {
  label: string;
  menu: {
    [key: string]: { label: string; value: string };
  };
  activeValue: string;
}
