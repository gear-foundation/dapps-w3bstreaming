import { server } from './server';
import config from './config';
import { api, isMetaReady } from './contract';

const main = async () => {
  await api.isReadyOrError;
  console.log(`Connected to ${await api.chain()}`);
  await isMetaReady;
  console.log(`Metadata initialized`);
  server.listen(Number(config.port), '0.0.0.0', () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

main().catch(error => {
  console.log(error);
  process.exit(1);
});
