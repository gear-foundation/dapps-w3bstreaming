import { useForm, isNotEmpty } from '@mantine/form';
import { Button, Calendar, DropzoneUploader, Input, InputArea } from '@/ui';
import styles from './LayoutCreateForm.module.scss';
import { cx } from '@/utils';
import { SectionProps } from './LayoutCreateForm.interface';
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
      startTimeDate: '',
      endTimeDate: '',
      image: '',
    },
    validate: {
      title: isNotEmpty('Enter stream title'),
      startTimeDate: (value, values) =>
        value === values.endTimeDate ? 'Start time shouldnt be equal to End time' : null,
      // image: isNotEmpty('Upload image'),
    },
  });

  const { getInputProps, setFieldValue, onSubmit, reset } = form;

  const handleChangeDate = (field: 'dayDate' | 'startTimeDate' | 'endTimeDate', value: string | Date) => {
    setFieldValue(field, value);
  };

  const handleTransformData = ({ title, description, dayDate, startTimeDate, endTimeDate, image }: any) => {
    const startDate = new Date(dayDate);
    startDate.setHours(startTimeDate.split(':')[0]);
    startDate.setMinutes(startTimeDate.split(':')[1]);
    startDate.setSeconds(0);
    const startTimestamp = startDate.getTime();

    const endDate = new Date(dayDate);
    endDate.setHours(endTimeDate.split(':')[0]);
    endDate.setMinutes(endTimeDate.split(':')[1]);
    endDate.setSeconds(0);
    const endTimestamp = endDate.getTime();

    const difference = endTimestamp - startTimestamp;

    const payload = {
      NewStream: {
        timestamp: difference,
        title,
        description: description || 'None',
      },
    };

    sendMessage(payload, {
      onSuccess: () => {
        reset();
      },
      onError: () => {
        throw new Error('error');
      },
    });
  };

  return (
    <div className={cx(styles.layout)}>
      <h1 className={cx(styles.title)}>Create stream</h1>
      <form onSubmit={onSubmit(handleTransformData)}>
        <div className={cx(styles.content)}>
          <div className={cx(styles.left)}>
            <div className={cx(styles['dropzone-wrapper'])}>
              <DropzoneUploader />
            </div>
            <Section title="Stream info">
              <div className={cx(styles.inputs)}>
                <div className={cx(styles.input)}>
                  <Input size="large" placeholder="Type stream title" {...getInputProps('title')} />
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
                <TimePicker onChange={(time: string | null) => handleChangeDate('startTimeDate', time as string)} />
                -
                <TimePicker onChange={(time: string | null) => handleChangeDate('endTimeDate', time as string)} />
              </div>
            </Section>
          </div>
        </div>
      </form>
    </div>
  );
}

export { LayoutCreateForm };
