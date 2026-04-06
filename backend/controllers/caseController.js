import Case from "../models/Case.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

/* CREATE CASE */

export const createCase = async (req, res) => {
  try {
    const {
      caseTitle,
      defendantName,
      defendantAddress,
      crimeType,
      committedDate,
      committedLocation,
      arrestingOfficer,
      dateOfArrest,
      presidingJudge,
      publicProsecutor,
      dateOfHearing,
      completionDate
    } = req.body;

    const lastCase = await Case.findOne().sort({ CIN: -1 });

    let newCIN = 1;
    if (lastCase) newCIN = lastCase.CIN + 1;

    const newCase = new Case({
      caseTitle,
      defendantName,
      defendantAddress,
      crimeType,
      committedDate,
      committedLocation,
      arrestingOfficer,
      dateOfArrest,
      presidingJudge,
      publicProsecutor,
      dateOfHearing,
      completionDate,
      CIN: newCIN,
      closed: false
    });

    await newCase.save();

    res.json(newCase);

  } catch (error) {
    res.status(500).json(error);
  }
};

/* GET ALL CASES */

export const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* GET SINGLE CASE */

export const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id).populate("sessions");

    res.json(caseData);

  } catch (error) {
    res.status(500).json(error);
  }
};

/* ADD SESSION */

export const addSession = async (req, res) => {
  try {
    const { attendingJudge, summary, nextHearingDate } = req.body;

    const newSession = new Session({
      attendingJudge,
      summary,
      nextHearingDate
    });

    await newSession.save();

    const caseData = await Case.findById(req.params.id);

    caseData.sessions.push(newSession._id);

    await caseData.save();

    res.json(newSession);

  } catch (error) {
    res.status(500).json(error);
  }
};

/* CLOSE CASE */

export const closeCase = async (req,res)=>{

try{

const caseData = await Case.findById(req.params.id)

caseData.closed = true
caseData.completionDate = new Date()

await caseData.save()

res.json({message:"Case closed"})

}catch(err){

res.status(500).json({message:"Error closing case"})

}

}