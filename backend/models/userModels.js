const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const db_link =
  "mongodb+srv://admin:EsfGAyuh6c3mHHww@cluster0.jsdigoj.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

//   SCHEMA
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      // 'this' will return whole schema obj and from that take email field.
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  // confirmPassword: {
  //   type: String,
  //   required: true,
  //   minLength: 6,
  //   validate: function () {
  //     return this.confirmPassword == this.password;
  //   },
  // },
});

// userSchema.pre("save", async function () {
//   let salt = await bcrypt.genSalt();
//   let hashedString = await bcrypt.hash(this.password, salt);
//   console.log(hashedString);
//   this.password = hashedString;
// });

// confirmPassword is same is password so no need to save it in db
// userSchema.pre("save", function () {
//   this.confirmPassword = undefined;
// });

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
