import clsx from 'clsx';

export const cx = (...styles: string[]) => clsx(...styles);

export const copyToClipboard = (value: string) =>
  navigator.clipboard.writeText(value).then(() => console.log('Copied!'));
