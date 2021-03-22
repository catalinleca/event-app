import mongoose from 'mongoose';
import { Password } from '../services/password';

// 1. An interface that describes the properties
// that are required to create a new User

interface UserAttrs {
    email: string
    password: string
}

// 2. An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// 3. An interface that describes the properties
// that a User Document has. Entry might end up
// with different set of props and we use this to check
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) { // direct changes to ret
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function(done: any) {
    // if we used an arrow function the value of this would be the context
    // inside the current file

    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed);
    }

    done() // need to call at the end
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}// typescript will still not understand if we do User.build(..) ofc => point 2

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
