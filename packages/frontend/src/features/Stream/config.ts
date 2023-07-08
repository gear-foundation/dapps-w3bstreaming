// export const RTC_CONFIG = { iceServers: [{ urls: 'stun:stun.deutscherskiverband.de:3478' }] };
export const RTC_CONFIG = {
  iceServers: [
    {
      urls: 'turn:turn-server.vara-network.io:3478',
      username: 'gear',
      credential: 'password',
    },
  ],
};
