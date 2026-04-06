import mongoose from "mongoose";

const { Schema } = mongoose;

const caseSchema = new Schema({
  caseTitle: {
    type: String,
    required: true,
  },

  defendantName: {
    type: String,
    required: true,
  },

  defendantAddress: {
    type: String,
    required: true,
  },

  crimeType: {
    type: String,
    required: true,
  },

  committedDate: {
    type: Date,
    required: true,
  },

  committedLocation: {
    type: String,
    required: true,
  },

  arrestingOfficer: {
    type: String,
    required: true,
  },

  dateOfArrest: {
    type: Date,
    required: true,
  },

  presidingJudge: {
    type: String,
    required: true,
  },

  publicProsecutor: {
    type: String,
    required: true,
  },

  dateOfHearing: {
    type: Date,
    required: true,
  },

  completionDate: {
    type: Date
  },

  CIN: {
    type: Number,
    required: true,
    unique: true,
  },

  closed: {
    type: Boolean,
    default: false,
  },

  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Session",
    },
  ],
});

const Case = mongoose.model("Case", caseSchema);

export default Case;