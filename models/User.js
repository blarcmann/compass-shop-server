var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email: { type: String, unique: true },
  username: String,
  password: String,
}, { timestamps: true });


userSchema.pre('save', next => {
  let user = this;
  bcrypt.hash(user.password, null, null, (error, hash) => {
    if (error) return next(error);
    user.password = hash;
    next();
  })
});

userSchema.methods.comparePassword = password => {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);