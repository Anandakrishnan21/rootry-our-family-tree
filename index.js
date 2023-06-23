const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

// MONGODB CONNECTION
mongoose
  .connect("mongodb://127.0.0.1:27017/familyDB", { useNewUrlParser: true })
  .then(() => {
    console.log("MONGO CONNECTIONS OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "thisisoneofthemoststrongestpassword",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(express.static("public"));

const requiredLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

app.get("/", (req, res) => {
  res.render("starting");
});

// REGISTER
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { password, username, firstName, lastName } = req.body;
  const user = new User({ username, password, firstName, lastName });
  await user.save();
  req.session.user_id = user._id;
  res.redirect(`/home?firstName=${user.firstName}&lastName=${user.lastName}`);
});

// LOGIN
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);

  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.redirect(
      `/home?firstName=${foundUser.firstName}&lastName=${foundUser.lastName}`
    );
  } else {
    res.redirect("/login");
  }
});

// INDEX
app.get("/home", requiredLogin, (req, res) => {
  const firstName = req.query.firstName;
  res.render("home", { firstName: firstName });
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// PERSONAL DETAILS PAGE
app.get("/home/profile", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("profile", {
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
