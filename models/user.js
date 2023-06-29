const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true, "first name cannot be blank"],
  },
  lastName: {
    type: String,
    require: [true, "Last name cannot be blank"],
  },
  username: {
    type: String,
    required: [true, "username cannot be blank"],
  },
  password: {
    type: String,
    required: [true, "password cannot be blank"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  birthday: {
    type: String,
  },
  address: {
    type: String,
  },
  location: {
    type: String,
  },
  image: {
    type: String,
  },
  fatherFname: {
    type:String,
  },
  fatherLname:{
    type: String,
  },
  fatherBirthday:{
    type: String,
  },
  fatherAddress:{
    type: String,
  },
  fatherLocation:{
    type: String,
  },
  motherFname:{
    type: String,
  },
  motherLname:{
    type: String,
  },
  motherBirthday:{
    type: String,
  },
  motherAddress:{
    type: String,
  },
  motherLocation:{
    type: String,
  },
  grandpa1Fname:{
    type: String,
  },
  grandpa1Lname:{
    type: String,
  },
  grandpa1Birthday:{
    type: String,
  },
  grandpa1Address:{
    type: String,
  },
  grandpa1Location:{
    type: String,
  },
  grandma1Fname:{
    type: String,
  },
  grandma1Lname:{
    type: String,
  },
  grandma1Birthday:{
    type: String,
  },
  grandma1Address:{
    type: String,
  },
  grandma1Location:{
    type: String,
  },
  grandpa2Fname:{
    type: String,
  },
  grandpa2Lname:{
    type: String,
  },
  grandpa2Birthday:{
    type: String,
  },
  grandpa2Address:{
    type: String,
  },
  grandpa2Location:{
    type: String,
  },
  grandma2Fname:{
    type: String,
  },
  grandma2Lname:{
    type: String,
  },
  grandma2Birthday:{
    type: String,
  },
  grandma2Address:{
    type: String,
  },
  grandma2Location:{
    type: String,
  },
});

userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  if (!foundUser) {
    return false;
  }
  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
