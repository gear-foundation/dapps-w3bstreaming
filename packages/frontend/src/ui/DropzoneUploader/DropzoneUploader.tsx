import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { cx } from '@/utils';
import picImage from '@/assets/icons/picture.png';
import closeIcon from '@/assets/icons/cross-icon.svg';
import styles from './DropzoneUploader.module.scss';
import { Button } from '../Button';

function DropzoneUploader() {
  const uploadUrl = 'https://httpbin.org/post';
  const [preview, setPreview] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    }).then(() => {
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/png': [],
      'image/jpg': [],
      'image/jpeg': [],
    },
    minSize: 760,
  });

  const handleRemovePreview = () => {
    setPreview('');
  };

  return (
    <div {...getRootProps()} className={cx(styles.dropzone)}>
      {!preview ? (
        <>
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className={cx(styles.label)}>
              <p className={cx(styles['label-title'])}>Drop the files here ...</p>
            </div>
          ) : (
            <div className={cx(styles.label)}>
              <img src={picImage} alt="upload" />
              <h5 className={cx(styles['label-title'])}>Upload photo</h5>
              <p className={cx(styles['label-description'])}>
                Image not less than 1280x760 in JPG, JPEG or PNG format, up to 1 MB in size
              </p>
            </div>
          )}
        </>
      ) : (
        <div />
      )}
      {preview && (
        <div className={cx(styles['uploaded-pic-wrapper'])}>
          <img src={preview} alt="preview" className={cx(styles['uploaded-pic'])} />
          <Button
            icon={closeIcon}
            variant="text"
            className={cx(styles['close-icon'])}
            label=""
            onClick={handleRemovePreview}
          />
        </div>
      )}
    </div>
  );
}

export { DropzoneUploader };
