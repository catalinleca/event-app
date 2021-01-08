import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is required!')
    }

    try {
        await mongoose.connect(
            'mongodb://auth-mongo-srv:27017/auth', {
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
