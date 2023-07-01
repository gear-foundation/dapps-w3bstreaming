import { cx } from '@/utils';
import styles from './StreamTeaser.module.scss';
import streamDateIcon from '@/assets/icons/hexagon-icon.png';
import streamPhoto from '@/assets/icons/photo_2023-05-28_18-47-34 1.png';
import speakerPhoto from '@/assets/icons/Ellipse 21.png';
import { StreamTeaserProps } from '../../types';

function StreamTeaser({ title, timestamp, description }: StreamTeaserProps) {
  const date = new Date(Number(timestamp.replace(/,/g, '')) * 1000);

  return (
    <div className={cx(styles.card)}>
      <div className={cx(styles['card-top'])}>
        <img className={cx(styles['card-top-image'])} src={streamPhoto} alt="" />
        <div className={cx(styles['card-top-date-container'])}>
          <div className={cx(styles['card-top-date'])}>
            <img className={cx(styles['card-top-date-image'])} src={streamDateIcon} alt="" />
            <div className={cx(styles['card-top-date-content'])}>
              <span className={cx(styles['card-top-date-day'])}>{date.getDate()}</span>
              <span className={cx(styles['card-top-date-month'])}>
                {date.toLocaleString('default', { month: 'short' })}
              </span>
            </div>
          </div>
        </div>
        <div className={cx(styles['card-top-speaker-container'])}>
          <div className={cx(styles['card-top-speaker'])}>
            <img className={cx(styles['card-top-speaker-photo'])} src={speakerPhoto} alt="" />
            <div className={cx(styles['card-top-speaker-content'])}>
              <span className={cx(styles['card-top-speaker-name'])}>Panha Sela</span>
              <span className={cx(styles['card-top-speaker-descr'])}>Speaker</span>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles['card-bottom'])}>
        <h5 className={cx(styles['card-bottom-label'])}>{title}</h5>
        <p className={cx(styles['card-bottom-description'])}>{description}</p>
      </div>
    </div>
  );
}

export { StreamTeaser };
