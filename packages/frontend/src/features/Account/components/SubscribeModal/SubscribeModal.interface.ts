export interface WalletModalProps {
  onClose: () => void;
  speakerId?: string;
  type: 'subscribe' | 'unsubscribe';
}
