import {MongoMemoryServer} from "mongodb-memory-server"
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[]
        }
    }
}

jest.mock('../nats-wrapper');

// we want it asap
process.env.STRIPE_KEY = "sk_test_VpoLZFNTOWF6JrvaKDrzGYDf00zyZXb4B2"

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    // before each test we are resetting all the data in the db
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({})
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();

})

global.signin = (id?: string) => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build the session object { jwt: myJwt }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string that s the cookie with the encoded data
    // string array because supertest
    return [`express:sess=${base64}`];
}
