import { Dropdown, Search } from '@ui';
import { cx } from '@/utils';
import styles from './StreamTeasers.module.scss';
import streamDateIcon from '@/assets/icons/hexagon-icon.png';

import streamPhoto from '@/assets/icons/photo_2023-05-28_18-47-34 1.png';
import speakerPhoto from '@/assets/icons/Ellipse 21.png';

const menu = {
  all: {
    label: 'All streams',
    value: 'all',
  },
  featured: {
    label: 'Featured streams',
    value: 'featured',
  },
  planned: {
    label: 'Planed streams',
    value: 'planed',
  },
  subscription: {
    label: 'My subscription streams',
    value: 'subscription',
  },
};

function StreamTeaser() {
  return (
    <div className={cx(styles.card)}>
      <div className={cx(styles['card-top'])}>
        <img className={cx(styles['card-top-image'])} src={streamPhoto} alt="" />
        <div className={cx(styles['card-top-date-container'])}>
          <div className={cx(styles['card-top-date'])}>
            <img className={cx(styles['card-top-date-image'])} src={streamDateIcon} alt="" />
            <div className={cx(styles['card-top-date-content'])}>
              <span className={cx(styles['card-top-date-day'])}>4</span>
              <span className={cx(styles['card-top-date-month'])}>Jun</span>
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
        <h5 className={cx(styles['card-bottom-label'])}>NFTs in Prague</h5>
        <p className={cx(styles['card-bottom-description'])}>
          Interested in unlocking the potential of programmable assets? Join the event learn about the exciting world of
          Dynamic NFTs and dsfdsfdsfdsf dsf dsf sdf sdf dssf sdf sdfdsf dsf
        </p>
      </div>
    </div>
  );
}

function StreamTeasers() {
  //TODO сделать выборку в меню

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <Dropdown label="All streams" menu={menu} activeValue={menu.all.value} />
        <Search />
      </div>
      <div className={cx(styles.content)}>
        <StreamTeaser />
        <StreamTeaser />
        <StreamTeaser />
        <StreamTeaser />
        <StreamTeaser />
      </div>
    </div>
  );
}

export { StreamTeasers };
