const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: validator } = require("validator");

// SCHEMA OF USER
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      index: true,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is not vaild");
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//TOKEN
userSchema.methods.generateAuthToken = async function () {
  const token = await jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_KEY
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// MIDDLEWARES FOR USER

// encrypt password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// LOGIN CHECK
userSchema.statics.findbyCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  // Check that email exist or not
  if (!user) throw new Error("Unable to login");

  // Check password match
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");

  // If user exist and password matches then return user
  return user;
};

// CREATE USER MODEL
const User = new mongoose.model("User", userSchema);

module.exports = User;
