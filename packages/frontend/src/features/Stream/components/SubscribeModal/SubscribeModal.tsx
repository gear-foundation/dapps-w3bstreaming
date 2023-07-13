import { Modal } from 'components';
import { cx } from '@/utils';
import varaIcon from '@/assets/icons/vara-coin-silver.png';
import playSVG from '@/assets/icons/play-icon.svg';
import cancelSVG from '@/assets/icons/cross-circle-icon.svg';

import styles from './SubscribeModal.module.scss';
import { Button } from '@/ui';
import { WalletModalProps } from './SubscribeModal.interface';
import { useSubscribeToStreamMessage } from '../../hooks';

function SubscribeModal({ speakerId, onClose }: WalletModalProps) {
  const sendSubscribeMessage = useSubscribeToStreamMessage();

  const handleSubscribe = () => {
    if (speakerId) {
      const payload = {
        Subscribe: {
          account_id: speakerId,
        },
      };

      sendSubscribeMessage(payload, {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          console.log('error');
        },
      });
    }
  };

  const handleCancelModal = () => {
    onClose();
    window.location.reload();
  };

  return (
    <Modal heading="Subscribe" onClose={onClose}>
      <div className={cx(styles.container)}>
        <p className={cx(styles.description)}>Are you sure you want to subscribe from this streamer?</p>
        <div className={cx(styles['cont-per-month'])}>
          <span className={cx(styles['cont-per-month-label'])}>Per month:</span>
          <img src={varaIcon} alt="vara" className={cx(styles['cont-per-month-vara'])} />
          <span className={cx(styles['cont-per-month-value'])}>1</span>
          <span className={cx(styles['cont-per-month-currency'])}>vara</span>
        </div>
        <div className={cx(styles.controls)}>
          <Button variant="primary" label="Subscribe" icon={playSVG} onClick={handleSubscribe} />
          <Button variant="text" label="Cancel" icon={cancelSVG} onClick={handleCancelModal} />
        </div>
      </div>
    </Modal>
  );
}

export { SubscribeModal };
