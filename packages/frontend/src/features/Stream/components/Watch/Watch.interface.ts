export interface SectionProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

export type StreamState = 'initialized' | 'loading' | 'success' | 'not-subscribed' | 'not-started';
