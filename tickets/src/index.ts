import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is required!')
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required!')
    }

    try {
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
