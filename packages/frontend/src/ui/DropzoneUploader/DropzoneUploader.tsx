import Dropzone from 'react-dropzone-uploader';
import { cx } from '@/utils';
import styles from './DropzoneUploader.module.scss';
import 'react-dropzone-uploader/dist/styles.css';
import { DropzoneUploaderProps } from './DropzoneUploader.interface';
import picImage from '@/assets/icons/picture.png';

function DropzoneUploader({ addClassnames, ...props }: DropzoneUploaderProps) {
  const getUploadParams = ({ meta }: any) => ({ url: 'https://httpbin.org/post' });

  const handleChangeStatus = ({ meta, file }: any, status: any) => {
    console.log(status, meta, file);
  };

  const handleSubmit = (files: any) => {
    console.log(files.map((f: any) => f.meta));
  };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*"
      addClassNames={{ dropzone: cx(styles.dropzone), inputLabel: cx(styles['dropzone-label']) }}
      inputContent={
        <div className={cx(styles.label)}>
          <img src={picImage} alt="upload" />
          <h5 className={cx(styles['label-title'])}>Upload photo</h5>
          <p className={cx(styles['label-description'])}>
            Image not less than 1280x760 in JPG, JPEG or PNG format, up to 1 MB in size
          </p>
        </div>
      }
      {...props}
    />
  );
}

export { DropzoneUploader };
