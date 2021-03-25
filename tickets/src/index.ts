 import mongoose from 'mongoose';
import { app } from './app';
 import {natsWrapper} from "./nats-wrapper";
 import {randomBytes} from "crypto";
 import { OrderCreatedListener } from "./events/listeners/order-created-listener";
 import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is required!')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required!')
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID is required!')
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL is required!')
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID is required!')
    }

    try {
        // in nats-depl.yaml at args -> -cid and ticketing
        await natsWrapper.connect(
          process.env.NATS_CLUSTER_ID,
          process.env.NATS_CLIENT_ID,
          process.env.NATS_URL
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

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

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
