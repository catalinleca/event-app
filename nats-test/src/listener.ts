import nats, { Message } from 'node-nats-streaming';
import {randomBytes} from "crypto";

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Listener connected to nats')

    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    })

    const options = stan.subscriptionOptions() // chain here more methods
        .setManualAckMode(true)
        .setDeliverAllAvailable()   // whenever our subscription gets created nats will try to send over all the events ever
        .setDurableName('accounting-service ');

    const subscription = stan.subscribe('ticket:created', 'queue-group-name', options)

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${(data)}`)
        }

        msg.ack();
    })
})

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close())
