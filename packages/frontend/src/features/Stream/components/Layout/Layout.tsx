import { useState } from 'react';
import { useParams } from 'react-router';
import styles from './Layout.module.scss';
import { cx } from '@/utils';
import { Button } from '@/ui';
import speakerPhoto from '@/assets/icons/Ellipse 21.png';
import editProfileSVG from '@/assets/icons/edit-profile-icon.svg';
import timerSVG from '@/assets/icons/timer-icon.svg';
import eyeSVG from '@/assets/icons/eye-icon.svg';
import { LayoutProps } from './Layout.interfaces';
import { SubscribeModal } from '../SubscribeModal';

function Layout({ isBroadcaster }: LayoutProps) {
  const { id: streamId } = useParams();
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);

  const handleCloseSubscribeModal = () => {
    setIsSubscribeModalOpen(false);
  };

  const handleOpenSubscribeModal = () => {
    setIsSubscribeModalOpen(true);
  };

  return (
    <div className={cx(styles.layout)}>
      <div className={cx(styles.left)}>
        <div className={cx(styles.title)}>Title</div>
        <div className={cx(styles['card-top-speaker-container'])}>
          <div className={cx(styles['card-top-speaker'])}>
            <img className={cx(styles['card-top-speaker-photo'])} src={speakerPhoto} alt="" />
            <div className={cx(styles['card-top-speaker-content'])}>
              <span className={cx(styles['card-top-speaker-name'])}>Panha Sela</span>
              <span className={cx(styles['card-top-speaker-descr'])}>Speaker</span>
            </div>
          </div>
        </div>
        <div className={cx(styles['stream-info'])}>Stream Info</div>
        <div className={cx(styles['stream-description'])}>
          Interested in unlocking the potential of programmable assets? Join the event learn about the exciting world of
          Dynamic NFTs and how they can revolutionize the art and gaming industries. Discover how Vara Network is
          leading the way in creating more interactive and engaging experiences for users
        </div>
      </div>
      <div className={cx(styles.right)}>
        <div className={cx(styles['views-and-time'])}>
          <div className={cx(styles.views)}>
            <img src={eyeSVG} alt="views" />
            <span>137</span>
          </div>
          <div className={cx(styles.time)}>
            <img src={timerSVG} alt="time" />
            <span>11:00</span>
          </div>
        </div>
        {isBroadcaster ? (
          <Button variant="outline" label="Edit Profile" icon={editProfileSVG} />
        ) : (
          <Button variant="primary" label="Subscribe" onClick={handleOpenSubscribeModal} />
        )}
      </div>
      {isSubscribeModalOpen && <SubscribeModal onClose={handleCloseSubscribeModal} streamId={streamId} />}
    </div>
  );
}

export { Layout };
