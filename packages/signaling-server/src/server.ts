import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { createServer } from 'http';
import express from 'express';

import { isUserSubscribed } from './contract';
import { isValidSig } from './helpers';
import {
  IAnswerMsg,
  IBroadcastMsg,
  ICandidateMsg,
  IOfferMsg,
  IStopBroadcastingMsg,
  IWatchMsg,
} from 'types';

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

export const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const connections = new Map<string, Socket>();
const streams = new Map<string, string>();
io.sockets.on('error', err => {
  console.error(err);
});

io.on('connection', socket => {
  socket.on('broadcast', (id: string, msg: IBroadcastMsg) => {
    connections.set(id, socket);
    streams.set(msg.streamId, id);
    console.log('BROADCASTING');
  });

  socket.on('watch', async (id: string, msg: IWatchMsg) => {
    console.log(`WATCH ADDRESS ${id}`);
    if (!streams.has(msg.streamId)) {
      return socket.emit('error', {
        message: `Stream with id ${msg.streamId} hasn't started yet`,
      });
    }

    if (!isValidSig(id, msg.signedMsg)) {
      console.log(id);
      console.log(msg.signedMsg);
      return socket.emit('error', { message: `Signature isn't valid` });
    }

    if (!(await isUserSubscribed(msg.streamId, id))) {
      return socket.emit('error', {
        message: `You aren't subscribed to stream with id ${msg.streamId}`,
      });
    }

    console.log(`WATCH ADDRESS SUCCESS ${id}`);

    const broadcasterId = streams.get(msg.streamId) as string;

    connections.get(broadcasterId)!.emit('watch', id, msg);

    connections.set(id, socket);
  });

  socket.on('stopBroadcasting', (_, msg: IStopBroadcastingMsg) => {
    if (streams.has(msg.streamId)) {
      connections.delete(streams.get(msg.streamId)!);
    }
  });

  socket.on('offer', (id, msg: IOfferMsg) => {
    console.log(id);
    console.log(msg);
    if (connections.has(msg.userId)) {
      connections.get(msg.userId)!.emit('offer', id, msg);
    }
  });

  socket.on('answer', (id, msg: IAnswerMsg) => {
    if (connections.has(id)) {
      connections.get(id)?.emit('answer', id, msg);
    }
  });

  socket.on('candidate', (id, msg: ICandidateMsg) => {
    if (connections.has(msg.id)) {
      connections.get(msg.id)?.emit('candidate', id, msg);
    }
  });

  socket.on('disconnect', r => {
    console.log('CLOSE', r);
  });
});
