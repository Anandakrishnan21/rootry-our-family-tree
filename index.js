const express = require("express");
const app = express();
const multer = require("multer");
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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
  const lastName = req.query.lastName;
  res.render("home", { firstName: firstName, lastName: lastName });
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// PROFILE PAGE
app.get("/profile", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("profile", {
        firstName: user.firstName,
        lastName: user.lastName,
        accountCreatedYear: user.createdAt,
        image: user.image,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

// PERSONAL DETAILS PAGE
app.get("/personal", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("personal", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        address: user.address,
        location: user.location,
        image: user.image,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

app.post("/personal", upload.single("image"), async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.birthday = req.body.birthday;
      user.address = req.body.address;
      user.location = req.body.location;
      user.image = req.file.filename;

      await user.save();

      res.render("personal", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        address: user.address,
        location: user.location,
        image: user.image,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

// TREE CREATION

app.get("/tree", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("tree", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        image: user.image,

        fatherFname: user.fatherFname,
        fatherLname: user.fatherLname,
        fatherBirthday: user.fatherBirthday,
        fatherAddress: user.fatherAddress,
        motherLocation: user.fatherLocation,

        motherFname: user.motherFname,
        motherLname: user.motherLname,
        motherBirthday: user.motherBirthday,
        motherAddress: user.motherAddress,
        motherLocation: user.motherLocation,

        grandpa1Fname: user.grandpa1Fname,
        grandpa1Lname: user.grandpa1Lname,
        grandpa1Birthday: user.grandpa1Birthday,
        grandpa1Address: user.grandpa1Address,
        grandpa1Location: user.grandpa1Location,

        grandma1Fname: user.grandma1Fname,
        grandma1Lname: user.grandma1Lname,
        grandma1Birthday: user.grandma1Birthday,
        grandma1Address: user.grandma1Address,
        grandma1Location: user.grandma1Location,

        grandpa2Fname: user.grandpa2Fname,
        grandpa2Lname: user.grandpa2Lname,
        grandpa2Birthday: user.grandpa2Birthday,
        grandpa2Address: user.grandpa2Address,
        grandpa2Location: user.grandpa2Location,

        grandma2Fname: user.grandma2Fname,
        grandma2Lname: user.grandma2Lname,
        grandma2Birthday: user.grandma2Birthday,
        grandma2Address: user.grandma2Address,
        grandma2Location: user.grandma2Location,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

// EXAMPLE TREE
app.get("/exampleTree", requiredLogin, async (req, res) => {
  const userId = req.session.user_id;
  const user = await User.findById(userId);
  if (user) {
    res.render("exampleTree", {
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    });
  }
});

app.post("/tree", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      user.motherFname = req.body.motherFname;
      user.motherLname = req.body.motherLname;
      user.motherBirthday = req.body.motherBirthday;
      user.motherAddress = req.body.motherAddress;
      user.motherLocation = req.body.motherLocation;

      await user.save();

      res.render("tree", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        image: user.image,

        motherFname: user.motherFname,
        motherLname: user.motherLname,
        motherBirthday: user.motherBirthday,
        motherAddress: user.motherAddress,
        motherLocation: user.motherLocation,

        fatherFname: user.fatherFname,
        fatherLname: user.fatherLname,
        fatherBirthday: user.fatherBirthday,
        fatherAddress: user.fatherAddress,
        fatherLocation: user.fatherLocation,

        grandpa1Fname: user.grandpa1Fname,
        grandpa1Lname: user.grandpa1Lname,
        grandpa1Birthday: user.grandpa1Birthday,
        grandpa1Address: user.grandpa1Address,
        grandpa1Location: user.grandpa1Location,

        grandma1Fname: user.grandma1Fname,
        grandma1Lname: user.grandma1Lname,
        grandma1Birthday: user.grandma1Birthday,
        grandma1Address: user.grandma1Address,
        grandma1Location: user.grandma1Location,

        grandpa2Fname: user.grandpa2Fname,
        grandpa2Lname: user.grandpa2Lname,
        grandpa2Birthday: user.grandpa2Birthday,
        grandpa2Address: user.grandpa2Address,
        grandpa2Location: user.grandpa2Location,

        grandma2Fname: user.grandma2Fname,
        grandma2Lname: user.grandma2Lname,
        grandma2Birthday: user.grandma2Birthday,
        grandma2Address: user.grandma2Address,
        grandma2Location: user.grandma2Location,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

app.post("/tree1", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      user.fatherFname = req.body.fatherFname;
      user.fatherLname = req.body.fatherLname;
      user.fatherBirthday = req.body.fatherBirthday;
      user.fatherAddress = req.body.fatherAddress;
      user.fatherLocation = req.body.fatherLocation;

      await user.save();

      res.render("tree", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        image: user.image,

        fatherFname: user.fatherFname,
        fatherLname: user.fatherLname,
        fatherBirthday: user.fatherBirthday,
        fatherAddress: user.fatherAddress,
        fatherLocation: user.fatherLocation,

        motherFname: user.motherFname,
        motherLname: user.motherLname,
        motherBirthday: user.motherBirthday,
        motherAddress: user.motherAddress,
        motherLocation: user.motherLocation,

        grandpa1Fname: user.grandpa1Fname,
        grandpa1Lname: user.grandpa1Lname,
        grandpa1Birthday: user.grandpa1Birthday,
        grandpa1Address: user.grandpa1Address,
        grandpa1Location: user.grandpa1Location,

        grandma1Fname: user.grandma1Fname,
        grandma1Lname: user.grandma1Lname,
        grandma1Birthday: user.grandma1Birthday,
        grandma1Address: user.grandma1Address,
        grandma1Location: user.grandma1Location,

        grandpa2Fname: user.grandpa2Fname,
        grandpa2Lname: user.grandpa2Lname,
        grandpa2Birthday: user.grandpa2Birthday,
        grandpa2Address: user.grandpa2Address,
        grandpa2Location: user.grandpa2Location,

        grandma2Fname: user.grandma2Fname,
        grandma2Lname: user.grandma2Lname,
        grandma2Birthday: user.grandma2Birthday,
        grandma2Address: user.grandma2Address,
        grandma2Location: user.grandma2Location,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

app.post("/tree2", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      user.grandma2Fname = req.body.grandma2Fname;
      user.grandma2Lname = req.body.grandma2Lname;
      user.grandma2Birthday = req.body.grandma2Birthday;
      user.grandma2Address = req.body.grandma2Address;
      user.grandma2Location = req.body.grandma2Location;

      await user.save();

      res.render("tree", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        image: user.image,

        fatherFname: user.fatherFname,
        fatherLname: user.fatherLname,
        fatherBirthday: user.fatherBirthday,
        fatherAddress: user.fatherAddress,
        fatherLocation: user.fatherLocation,

        motherFname: user.motherFname,
        motherLname: user.motherLname,
        motherBirthday: user.motherBirthday,
        motherAddress: user.motherAddress,
        motherLocation: user.motherLocation,

        grandpa1Fname: user.grandpa1Fname,
        grandpa1Lname: user.grandpa1Lname,
        grandpa1Birthday: user.grandpa1Birthday,
        grandpa1Address: user.grandpa1Address,
        grandpa1Location: user.grandpa1Location,

        grandma1Fname: user.grandma1Fname,
        grandma1Lname: user.grandma1Lname,
        grandma1Birthday: user.grandma1Birthday,
        grandma1Address: user.grandma1Address,
        grandma1Location: user.grandma1Location,

        grandpa2Fname: user.grandpa2Fname,
        grandpa2Lname: user.grandpa2Lname,
        grandpa2Birthday: user.grandpa2Birthday,
        grandpa2Address: user.grandpa2Address,
        grandpa2Location: user.grandpa2Location,

        grandma2Fname: user.grandma2Fname,
        grandma2Lname: user.grandma2Lname,
        grandma2Birthday: user.grandma2Birthday,
        grandma2Address: user.grandma2Address,
        grandma2Location: user.grandma2Location,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});
app.post("/tree3", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      user.grandpa2Fname = req.body.grandpa2Fname;
      user.grandpa2Lname = req.body.grandpa2Lname;
      user.grandpa2Birthday = req.body.grandpa2Birthday;
      user.grandpa2Address = req.body.grandpa2Address;
      user.grandpa2Location = req.body.grandpa2Location;

      await user.save();

      res.render("tree", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        image: user.image,

        fatherFname: user.fatherFname,
        fatherLname: user.fatherLname,
        fatherBirthday: user.fatherBirthday,
        fatherAddress: user.fatherAddress,
        fatherLocation: user.fatherLocation,

        motherFname: user.motherFname,
        motherLname: user.motherLname,
        motherBirthday: user.motherBirthday,
        motherAddress: user.motherAddress,
        motherLocation: user.motherLocation,

        grandpa1Fname: user.grandpa1Fname,
        grandpa1Lname: user.grandpa1Lname,
        grandpa1Birthday: user.grandpa1Birthday,
        grandpa1Address: user.grandpa1Address,
        grandpa1Location: user.grandpa1Location,

        grandma1Fname: user.grandma1Fname,
        grandma1Lname: user.grandma1Lname,
        grandma1Birthday: user.grandma1Birthday,
        grandma1Address: user.grandma1Address,
        grandma1Location: user.grandma1Location,

        grandpa2Fname: user.grandpa2Fname,
        grandpa2Lname: user.grandpa2Lname,
        grandpa2Birthday: user.grandpa2Birthday,
        grandpa2Address: user.grandpa2Address,
        grandpa2Location: user.grandpa2Location,

        grandma2Fname: user.grandma2Fname,
        grandma2Lname: user.grandma2Lname,
        grandma2Birthday: user.grandma2Birthday,
        grandma2Address: user.grandma2Address,
        grandma2Location: user.grandma2Location,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});
app.post("/tree4", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      user.grandma1Fname = req.body.grandma1Fname;
      user.grandma1Lname = req.body.grandma1Lname;
      user.grandma1Birthday = req.body.grandma1Birthday;
      user.grandma1Address = req.body.grandma1Address;
      user.grandma1Location = req.body.grandma1Location;

      await user.save();

      res.render("tree", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        image: user.image,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        image: user.image,

        fatherFname: user.fatherFname,
        fatherLname: user.fatherLname,
        fatherBirthday: user.fatherBirthday,
        fatherAddress: user.fatherAddress,
        fatherLocation: user.fatherLocation,

        motherFname: user.motherFname,
        motherLname: user.motherLname,
        motherBirthday: user.motherBirthday,
        motherAddress: user.motherAddress,
        motherLocation: user.motherLocation,

        grandpa1Fname: user.grandpa1Fname,
        grandpa1Lname: user.grandpa1Lname,
        grandpa1Birthday: user.grandpa1Birthday,
        grandpa1Address: user.grandpa1Address,
        grandpa1Location: user.grandpa1Location,

        grandma1Fname: user.grandma1Fname,
        grandma1Lname: user.grandma1Lname,
        grandma1Birthday: user.grandma1Birthday,
        grandma1Address: user.grandma1Address,
        grandma1Location: user.grandma1Location,

        grandpa2Fname: user.grandpa2Fname,
        grandpa2Lname: user.grandpa2Lname,
        grandpa2Birthday: user.grandpa2Birthday,
        grandpa2Address: user.grandpa2Address,
        grandpa2Location: user.grandpa2Location,

        grandma2Fname: user.grandma2Fname,
        grandma2Lname: user.grandma2Lname,
        grandma2Birthday: user.grandma2Birthday,
        grandma2Address: user.grandma2Address,
        grandma2Location: user.grandma2Location,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

app.post("/tree5", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      user.grandpa1Fname = req.body.grandpa1Fname;
      user.grandpa1Lname = req.body.grandpa1Lname;
      user.grandpa1Birthday = req.body.grandpa1Birthday;
      user.grandpa1Address = req.body.grandpa1Address;
      user.grandpa1Location = req.body.grandpa1Location;

      await user.save();

      res.render("tree", {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        image: user.image,

        fatherFname: user.fatherFname,
        fatherLname: user.fatherLname,
        fatherBirthday: user.fatherBirthday,
        fatherAddress: user.fatherAddress,
        fatherLocation: user.fatherLocation,

        motherFname: user.motherFname,
        motherLname: user.motherLname,
        motherBirthday: user.motherBirthday,
        motherAddress: user.motherAddress,
        motherLocation: user.motherLocation,

        grandpa1Fname: user.grandpa1Fname,
        grandpa1Lname: user.grandpa1Lname,
        grandpa1Birthday: user.grandpa1Birthday,
        grandpa1Address: user.grandpa1Address,
        grandpa1Location: user.grandpa1Location,

        grandma1Fname: user.grandma1Fname,
        grandma1Lname: user.grandma1Lname,
        grandma1Birthday: user.grandma1Birthday,
        grandma1Address: user.grandma1Address,
        grandma1Location: user.grandma1Location,

        grandpa2Fname: user.grandpa2Fname,
        grandpa2Lname: user.grandpa2Lname,
        grandpa2Birthday: user.grandpa2Birthday,
        grandpa2Address: user.grandpa2Address,
        grandpa2Location: user.grandpa2Location,

        grandma2Fname: user.grandma2Fname,
        grandma2Lname: user.grandma2Lname,
        grandma2Birthday: user.grandma2Birthday,
        grandma2Address: user.grandma2Address,
        grandma2Location: user.grandma2Location,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

// ARTICLES

app.get("/article", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("article", {
        firstName: user.firstName,
        lastName: user.firstName,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

app.get("/article1", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("article1", {
        firstName: user.firstName,
        lastName: user.firstName,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

app.get("/article2", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("article2", {
        firstName: user.firstName,
        lastName: user.firstName,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});


//  SECURITY

app.get("/security", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("security", {
        firstName: user.firstName,
        lastName: user.firstName,
        username: user.username,
        password: user.password,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

app.post("/security", async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      user.username = req.body.username;
      user.password = req.body.password;
      await user.save();

      res.render("security", {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

// FEEDBACK FORM
app.get("/feedback", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("feedback", {
        firstName: user.firstName,
        lastName: user.firstName,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

// VIDEO
app.get("/buildVideo", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("buildVideo", {
        firstName: user.firstName,
        lastName: user.firstName,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});

// FORM GROUPS
app.get("/cluster", requiredLogin, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    if (user) {
      res.render("cluster", {
        firstName: user.firstName,
        lastName: user.firstName,
      });
    }
  } catch (error) {
    res.render("error", { error });
  }
});



app.listen(3000, () => {
  console.log("server is running on port 3000");
});
