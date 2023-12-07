import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "node:crypto";
import { generateToken } from "../services/authentication.js";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    profileImg: {
      type: String,
      default: "/images/profile.png",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = randomBytes(16).toString();
  if (!this.isModified("password")) return;

  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.methods.matchPassword = async function matchPassword(
  email,
  password
) {
  const user = this;
  const userProvidedHash = createHmac("sha256", this.salt)
    .update(password)
    .digest("hex");
  if (this.password === userProvidedHash) {
    console.log(`login successfull`);
    return generateToken(user);
  } else {
    console.log("login failed");
  }
};

const USER = model("user", userSchema);
export default USER;
