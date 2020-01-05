import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

let accountSchema = new Schema ({
  email: String,
  password: String
});

accountSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', accountSchema);
