const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

dotenv.config();

const Case = require("./models/case");
const User = require("./models/user");
const Session = require("./models/session");

const app = express();

/* ================= SECURITY MIDDLEWARE ================= */

app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

/* ================= EXPRESS CONFIG ================= */

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

/* ================= AUTH MIDDLEWARE ================= */

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/signin");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.username;
    next();
  } catch (err) {
    return res.redirect("/signin");
  }
}

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect("/dashboard");
  }
  res.render("home", { current: null });
});

// app.get("/", isLoggedIn, async (req, res) => {
//   const current = await User.findOne({ username: req.user });
//   const cases = await Case.find();

//   if (current.isLawer || current.isJudge) {
//     res.render("lawer", { cur: cases, due: current.due, current });
//   } else {
//     res.render("home", { current });
//   }
// });

app.get("/dashboard", isLoggedIn, async (req, res) => {
  const current = await User.findOne({ username: req.user });
  const cases = await Case.find();

  if (current.isLawer || current.isJudge) {
    res.render("lawer", { cur: cases, due: current.due, current });
  } else {
    res.render("home", { current });
  }
});

app.get("/signin", (req, res) => {
  res.render("signin", { error: "" });
});

app.get("/signup", (req, res) => {
  res.render("signup", { errors: [] });
});

/* ================= SIGNUP ================= */

app.post("/signup", async (req, res) => {
  try {
    const { email, username, secretkey, password, confirmPassword } = req.body;
    const errors = [];

    if (!email || !username || !password || !confirmPassword || !secretkey) {
      errors.push("All fields are required");
    }

    if (secretkey !== process.env.SECRET_KEY) {
      errors.push("Invalid Secret Key");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (errors.length > 0) {
      return res.render("signup", { errors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", { errors: ["User already exists"] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.redirect("/signin");
  } catch (err) {
    console.log(err);
    res.render("signup", { errors: ["Something went wrong"] });
  }
});

/* ================= SIGNIN ================= */

app.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.render("signin", { error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("signin", { error: "Incorrect password" });
    }

    const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { 
        expiresIn: "1d",
        algorithm: "HS256"
    }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("signin", { error: "Login failed" });
  }
});

/* ================= SIGNOUT ================= */

app.get("/signout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/signin");
});

/* ================= CHANGE PASSWORD ================= */

app.get("/changepassword", isLoggedIn, async (req, res) => {
  const current = await User.findOne({ username: req.user });
  res.render("changePassword", { current, error: [] });
});

app.post("/changepassword", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user });
    const errors = [];

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isMatch) errors.push("Invalid current password");
    if (req.body.newPassword.length < 6)
      errors.push("New password must be 6+ characters");
    if (req.body.newPassword !== req.body.confirmPassword)
      errors.push("Passwords do not match");

    if (errors.length > 0) {
      return res.render("changePassword", { error: errors, current: user });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    await user.save();

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get('/addcase', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user });

    if (!user.isRegistrer) {
      return res.redirect('/');
    }

    res.render("addcase", { error: "" });
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard');
  }
});

app.post('/addcase', isLoggedIn, async (req, res) => {
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

    if (!caseTitle || !defendantName) {
      return res.render("addcase", { error: "Please enter required fields" });
    }

    // 🔥 Auto generate CIN safely
    const lastCase = await Case.findOne().sort({ CIN: -1 });

    let newCIN = 1;
    if (lastCase && lastCase.CIN) {
      newCIN = lastCase.CIN + 1;
    }

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
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.render("addcase", { error: "Error adding case" });
  }
});

app.get('/allcases', isLoggedIn, async (req, res) => {
  try {
    const current = await User.findOne({ username: req.user });
    const cases = await Case.find();

    res.render("cases", { cur: cases, current });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

app.get('/pastcases', isLoggedIn, async (req, res) => {
  try {
    const current = await User.findOne({ username: req.user });

    const cases = await Case.find({ closed: true });
    console.log("Past cases:", cases);

    res.render("cases", { cur: cases, current });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

app.get('/activecases', isLoggedIn, async (req, res) => {
  try {
    const current = await User.findOne({ username: req.user });

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const activeCases = await Case.find({
    closed: false,
    dateOfHearing: { $gte: today, $lt: tomorrow }
    });


    res.render("cases", { cur: activeCases, current });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

app.get('/upcomingcases', isLoggedIn, async (req, res) => {
  try {
    const current = await User.findOne({ username: req.user });
    const today = new Date();

    const upcomingCases = await Case.find({
      closed: false,
      dateOfHearing: { $gt: today }
    });

    res.render("cases", { cur: upcomingCases, current });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

app.get('/case/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    const current = await User.findOne({ username: req.user });
    if (!current) return res.redirect('/signin');

    const currCase = await Case.findById(id).populate('sessions');
    if (!currCase) return res.redirect('/allcases');

    // Lawyer fee logic
    if (current.isLawer) {
      current.due += 5;
      await current.save();
    }

    const isRegistrer = current.isRegistrer === true;

    res.render('casedetails', {
      currCase,
      isRegistrer,
      current
    });

  } catch (err) {
    console.log(err);
    res.redirect('/allcases');
  }
});

app.post('/case/:id/addSession', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { attendingJudge, summary, nextHearingDate } = req.body;

    if (!attendingJudge || !summary || !nextHearingDate) {
      return res.send("All fields are required");
    }

    const currCase = await Case.findById(id);
    if (!currCase) return res.redirect('/allcases');

    const newSession = new Session({
      attendingJudge,
      summary,
      nextHearingDate
    });

    await newSession.save();

    currCase.sessions.push(newSession._id);
    await currCase.save();

    res.redirect(`/case/${id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/allcases');
  }
});

app.post('/case/:id/closeCase', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    const curcase = await Case.findById(id);
    if (!curcase) return res.redirect('/allcases');

    curcase.closed = true;
    await curcase.save();

    res.redirect('/case/' + id);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

app.get('/about', (req, res) => {
  res.render('about', { current: "" });
});

app.post('/addjudge', isLoggedIn,async (req, res) => {
  try {
    const current = await User.findOne({ username: req.user });

    if (!current.isRegistrer) {
        return res.redirect('/');
    }
    const { emailJudge, userNameJudge, passwordJudge } = req.body;

    if (!emailJudge || !userNameJudge || !passwordJudge) {
      return res.redirect('/');
    }

    const existingUser = await User.findOne({ username: userNameJudge });
    if (existingUser) {
      return res.redirect('/');
    }

    const hashedPassword = await bcrypt.hash(passwordJudge, 10);

    const newJudge = new User({
      email: emailJudge,
      username: userNameJudge,
      password: hashedPassword,
      isRegistrer: false,
      isJudge: true,
      isLawer: false,
      due: 0
    });

    await newJudge.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

app.post('/addlawer', isLoggedIn, async (req, res) => {
  try {
    const current = await User.findOne({ username: req.user });

    if (!current.isRegistrer) {
      return res.redirect('/');
    }

    const { emailLawyer, userNameLawyer, passwordLawyer } = req.body;

    if (!emailLawyer || !userNameLawyer || !passwordLawyer) {
      return res.redirect('/dashboard');
    }

    const existingUser = await User.findOne({ username: userNameLawyer });
    if (existingUser) {
      return res.redirect('/dashboard');
    }

    const hashedPassword = await bcrypt.hash(passwordLawyer, 10);

    const newLawyer = new User({
      email: emailLawyer,
      username: userNameLawyer,
      password: hashedPassword,
      isRegistrer: false,
      isJudge: false,
      isLawer: true,
      due: 0
    });

    await newLawyer.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard');
  }
});



/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

/* ================= SERVER ================= */

app.listen(process.env.PORT || 9000, () => {
  console.log("Server running...");
});
