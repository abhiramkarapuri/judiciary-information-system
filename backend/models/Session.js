import mongoose from "mongoose";

const { Schema } = mongoose;

const sessionSchema = new Schema(
{
  attendingJudge: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  nextHearingDate: {
    type: Date,
    required: true
  }
},
{
  timestamps: true
}
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
// One to many relationship -> one case many comments. So we store reference to comments in case.