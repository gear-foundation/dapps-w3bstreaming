import { Button, Calendar, DropzoneUploader, Input, InputArea } from '@/ui';
import styles from './LayoutCreateForm.module.scss';
import { cx } from '@/utils';
import { SectionProps } from './LayoutCreateForm.interface';
import { TimePicker } from '@/ui/TimePicker';
import CreateSVG from '@/assets/icons/correct-icon.svg';
import CrossSVG from '@/assets/icons/cross-circle-icon.svg';

function Section({ title, children }: SectionProps) {
  return (
    <div>
      <h5 className={cx(styles['section-label'])}>{title}</h5>
      {children}
    </div>
  );
}

function LayoutCreateForm() {
  return (
    <div className={cx(styles.layout)}>
      <h1 className={cx(styles.title)}>Create stream</h1>
      <div className={cx(styles.content)}>
        <div className={cx(styles.left)}>
          <div className={cx(styles['dropzone-wrapper'])}>
            <DropzoneUploader />
          </div>
          <Section title="Stream info">
            <div className={cx(styles.inputs)}>
              <div className={cx(styles.input)}>
                <Input size="large" placeholder="Type stream title" />
              </div>
              <div className={cx(styles.input)}>
                <InputArea placeholder="Type stream description" />
              </div>
              <div className={cx(styles.controls)}>
                <Button variant="primary" label="Create" icon={CreateSVG} size="large" />
                <Button variant="text" label="Cancel" icon={CrossSVG} size="large" />
              </div>
            </div>
          </Section>
        </div>
        <div className={cx(styles.right)}>
          <Section title="Stream date">
            <div className={cx(styles['datepicker-wrapper'])}>
              <Calendar />
            </div>
          </Section>
          <Section title="Stream time">
            <div className={cx(styles['time-pickers-wrapper'])}>
              <TimePicker />
              -
              <TimePicker />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

export { LayoutCreateForm };
