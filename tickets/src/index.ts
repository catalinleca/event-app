 import mongoose from 'mongoose';
import { app } from './app';
 import {natsWrapper} from "./nats-wrapper";
 import {randomBytes} from "crypto";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is required!')
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required!')
    }

    try {
        // in nats-deply.yaml at args -> -cid and ticketing
        await natsWrapper.connect(
          'ticketing',
          randomBytes(4).toString('hex'),
          'http://nats-srv:4222'
        )

        // we could put these in the connect method but we want them in a more central location
        natsWrapper.client.on('close', () => {
          console.log('NATS connection closed');

          // if NATS pods goes down, the process exists entirely
          // tickets deployment pod will go down and will be started
          // again by the deployment
          process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }); // mongodb instance in our other pod
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('app listening on port 3000');
    })

};

start()
