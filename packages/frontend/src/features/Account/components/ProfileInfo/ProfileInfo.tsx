import styles from './ProfileInfo.module.scss';
import { ProfileaInfoProps } from './ProfileInfo.interfaces';
import { cx } from '@/utils';
import Rect from '@/assets/icons/Rectangle 88.png'; //TODO remove after api connection
import { Button } from '@/ui';
import EditProfileIcon from '@/assets/icons/edit-profile-icon.svg';

function ProfileInfo(props: ProfileaInfoProps) {
  return (
    <div className={cx(styles['profile-info'])}>
      <img src={Rect} alt="profile" />
      <p className={cx(styles['profile-info-name'])}>Panha Sela</p>
      <p className={cx(styles['profile-info-subs'])}>
        <span className={cx(styles['profile-info-subs-value'])}>13,421 </span>
        <span className={cx(styles['profile-info-subs-caption'])}>subscribers</span>
      </p>
      <p className={cx(styles['profile-info-role'])}>Speaker</p>
      <Button variant="outline" size="large" label="Edit Profile" icon={EditProfileIcon} />
    </div>
  );
}

export { ProfileInfo };
