import { useState } from 'react';
import { TimePicker as ReactTimePicker } from 'react-time-picker';
import { Value } from 'react-time-picker/dist/cjs/shared/types';
import { cx } from '@/utils';
import styles from './TimePicker.module.scss';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

function TimePicker() {
  const [value, setValue] = useState<Value>('10:00');

  const handleChangeTime = (val: Value) => {
    setValue(val);
  };

  return (
    <div className={cx(styles.container)}>
      <ReactTimePicker
        clockIcon={null}
        clearIcon={null}
        disableClock
        onChange={handleChangeTime}
        value={value}
        className={cx(styles.input)}
      />
    </div>
  );
}

export { TimePicker };
