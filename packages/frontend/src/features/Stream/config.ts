// export const RTC_CONFIG = { iceServers: [{ urls: 'stun:stun.deutscherskiverband.de:3478' }] };
export const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:52.53.225.230:3478',
      username: 'gear',
      credential: 'gear789',
    },
  ],
};
