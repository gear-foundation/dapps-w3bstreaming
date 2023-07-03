import { useState } from 'react';
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { Button } from '@/ui';
import { cx } from '@/utils';
import chevronLeftSVG from '@/assets/icons/chevron-left.svg';
import chevronRightSVG from '@/assets/icons/chevron-right.svg';
import styles from './Calendar.module.scss';
import { CalendarProps } from './Calendar.interfaces';

import 'react-datepicker/dist/react-datepicker.css';

function Calendar({ ...props }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleDisableTiles = (date: any): boolean => date > new Date().setDate(new Date().getDate() - 1);

  const handleChangeCalendar = (value: Date | null) => {
    setSelectedDate(value);
  };

  const areDaysEqaual = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const handleRenderCustomHeader = ({
    monthDate,
    decreaseMonth,
    increaseMonth,
  }: ReactDatePickerCustomHeaderProps): any => {
    const onPrevMonth = () => {
      decreaseMonth();
    };

    const onNextMonth = () => {
      increaseMonth();
    };

    return (
      <div className={cx(styles['calendar-header'])}>
        <span className={cx(styles['calendar-header-month'])}>
          {monthDate.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })}
        </span>
        <div className={cx(styles['calendar-header-controls'])}>
          <Button variant="icon" label="" icon={chevronLeftSVG} onClick={onPrevMonth} />
          <Button variant="icon" label="" icon={chevronRightSVG} onClick={onNextMonth} />
        </div>
      </div>
    );
  };

  const handleDayClassname = (date: any) => {
    if (areDaysEqaual(date, selectedDate as Date)) {
      return cx(styles['calendar-day'], styles['calendar-day-selected']);
    }

    return cx(styles['calendar-day']);
  };

  const handleWeekDayClassname = () => cx(styles['calendar-week-day']);

  return (
    <div className={cx(styles['calendar-container'])}>
      <DatePicker
        selected={selectedDate}
        onChange={handleChangeCalendar}
        inline
        showPopperArrow={false}
        fixedHeight
        renderCustomHeader={handleRenderCustomHeader}
        dayClassName={handleDayClassname}
        weekDayClassName={handleWeekDayClassname}
        formatWeekDay={(day) => day.substring(0, 3)}
        filterDate={handleDisableTiles}
        {...props}>
        <div />
      </DatePicker>
    </div>
  );
}

export { Calendar };
