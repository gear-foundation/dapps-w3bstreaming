import { MediaTrackSequenceType } from './types';

export class MediaStreamSequence {
  mediaTrackSequence: Partial<Record<MediaTrackSequenceType, number>> = {};

  getSequence() {
    return this.mediaTrackSequence;
  }

  getLength() {
    return Object.values(this.mediaTrackSequence).length;
  }

  add(type: MediaTrackSequenceType) {
    this.mediaTrackSequence[type] = this.getLength();
  }

  getIndex(type: MediaTrackSequenceType) {
    return this.mediaTrackSequence[type];
  }

  getIndexes(types: MediaTrackSequenceType[]) {
    return types
      .filter((type) => this.mediaTrackSequence[type] !== undefined)
      .map((type) => this.mediaTrackSequence[type] as number);
  }
}
