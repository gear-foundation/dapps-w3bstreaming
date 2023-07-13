import { useForm, isNotEmpty } from '@mantine/form';
import { Button, Calendar, DropzoneUploader, Input, InputArea } from '@/ui';
import styles from './LayoutCreateForm.module.scss';
import { cx } from '@/utils';
import { FormValues, SectionProps } from './LayoutCreateForm.interface';
import { TimePicker } from '@/ui/TimePicker';
import CreateSVG from '@/assets/icons/correct-icon.svg';
import CrossSVG from '@/assets/icons/cross-circle-icon.svg';
import { useCreateStreamSendMessage } from '../../hooks';

function Section({ title, children }: SectionProps) {
  return (
    <div>
      <h5 className={cx(styles['section-label'])}>{title}</h5>
      {children}
    </div>
  );
}

function LayoutCreateForm() {
  const sendMessage = useCreateStreamSendMessage();
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      dayDate: new Date(),
      startTime: '',
      endTime: '',
      imgLink: '',
    },
    validate: {
      title: isNotEmpty('Stream title is required'),
      startTime: (value, values) => (value === values.endTime ? 'Start time shouldnt be equal to End time' : null),
    },
  });

  const { errors, getInputProps, setFieldValue, onSubmit, reset } = form;

  const handleChangeDate = (field: 'dayDate' | 'startTime' | 'endTime', value: string | Date) => {
    setFieldValue(field, value);
  };

  const handleTransformData = ({ title, description, dayDate, startTime, endTime, imgLink }: FormValues) => {
    const day = dayDate.getDate();
    const month = dayDate.getMonth();
    const year = dayDate.getFullYear();

    const startDate = new Date(year, month, day);

    startDate.setHours(Number(startTime.split(':')[0]));
    startDate.setMinutes(Number(startTime.split(':')[1]));
    startDate.setSeconds(0);
    const startTimestamp = startDate.getTime();

    const endDate = new Date(year, month, day);
    endDate.setHours(Number(endTime.split(':')[0]));
    endDate.setMinutes(Number(endTime.split(':')[1]));
    endDate.setSeconds(0);
    const endTimestamp = endDate.getTime();

    const payload = {
      NewStream: {
        startTime: startTimestamp,
        endDate: endTimestamp,
        title,
        description,
        imgLink,
      },
    };

    sendMessage(payload, {
      onSuccess: () => {
        reset();
      },
      onError: () => {
        console.log('error');
      },
    });
  };

  const handleDropImg = (preview: string) => {
    setFieldValue('imgLink', preview);
  };

  return (
    <div className={cx(styles.layout)}>
      <h1 className={cx(styles.title)}>Create stream</h1>
      <form onSubmit={onSubmit(handleTransformData)}>
        <div className={cx(styles.content)}>
          <div className={cx(styles.left)}>
            <div className={cx(styles['dropzone-wrapper'])}>
              <DropzoneUploader onDropFile={handleDropImg} />
            </div>
            <Section title="Stream info">
              <div className={cx(styles.inputs)}>
                <div className={cx(styles.input)}>
                  <Input size="large" placeholder="Type stream title" {...getInputProps('title')} />
                  <span className={cx(styles['field-error'])}>{errors.title}</span>
                </div>
                <div className={cx(styles.input)}>
                  <InputArea placeholder="Type stream description" {...getInputProps('description')} />
                </div>
                <div className={cx(styles.controls)}>
                  <Button variant="primary" label="Create" icon={CreateSVG} size="large" type="submit" />
                  <Button variant="text" label="Cancel" icon={CrossSVG} size="large" />
                </div>
              </div>
            </Section>
          </div>
          <div className={cx(styles.right)}>
            <Section title="Stream date">
              <div className={cx(styles['datepicker-wrapper'])}>
                <Calendar onChange={(day: Date) => handleChangeDate('dayDate', day)} />
              </div>
            </Section>
            <Section title="Stream time">
              <div className={cx(styles['time-pickers-wrapper'])}>
                <TimePicker onChange={(time: string | null) => handleChangeDate('startTime', time as string)} />
                -
                <TimePicker onChange={(time: string | null) => handleChangeDate('endTime', time as string)} />
              </div>
              <span className={cx(styles['field-error'])}>{errors.startTime}</span>
            </Section>
          </div>
        </div>
      </form>
    </div>
  );
}

export { LayoutCreateForm };
