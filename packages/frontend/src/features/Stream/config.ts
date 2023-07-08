// export const RTC_CONFIG = { iceServers: [{ urls: 'stun:stun.deutscherskiverband.de:3478' }] };
export const RTC_CONFIG = {
  iceServers: [
    {
      urls: 'turn:52.53.225.230:3478',
      username: 'gear',
      credential: 'gear789',
    },
  ],
};
