/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, MouseEvent } from 'react';
import crossSVG from '@/assets/icons/cross-icon.svg';
import styles from './Modal.module.scss';
import { ModalProps } from './Modal.interface';
import { cx } from '@/utils';
import { Button } from '@/ui';

function Modal({ heading, children, onClose }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  const disableScroll = () => document.body.classList.add('modal-open');
  const enableScroll = () => document.body.classList.remove('modal-open');

  const open = () => {
    ref.current?.showModal();
    disableScroll();
  };

  const close = () => {
    ref.current?.close();
    enableScroll();
  };

  useEffect(() => {
    open();

    return () => close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = ({ target }: MouseEvent) => {
    const isBackdropClick = target === ref.current;

    if (isBackdropClick) {
      onClose();
    }
  };

  return (
    <dialog ref={ref} onClick={handleClick} className={cx(styles.modal)}>
      <div className={cx(styles.wrapper)}>
        <header className={cx(styles.header)}>
          <h2>{heading}</h2>
          <Button variant="icon" size="small" label="" icon={crossSVG} onClick={onClose} />
        </header>
        {children}
      </div>
    </dialog>
  );
}

export { Modal };
