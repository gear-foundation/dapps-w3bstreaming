import { Moment } from 'moment';

export interface TimePickerProps {
  onChange?: (time: Moment) => void;
}
