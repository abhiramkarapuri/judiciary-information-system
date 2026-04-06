import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
{
  email: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isRegistrer: {
    type: Boolean,
    default: true,
  },

  isJudge: {
    type: Boolean,
    default: false,
  },

  isLawyer: {
    type: Boolean,
    default: false,
  },

  due: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true
}
);

const User = mongoose.model("User", userSchema);

export default User;