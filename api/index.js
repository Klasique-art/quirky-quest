const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;
const cors = require("cors");

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const User = require("./models/user");

mongoose
  .connect("mongodb+srv://felix:felix@cluster0.ng5szdk.mongodb.net/")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err, "Error connecting to database");
  });

app.listen(port, () => {
  console.log(`App listening at http://192.168.107.148:${port}`);
});

// endpoint to register a user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "User already exists" });
    }

    // create a new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      password,
    });

    // generate a verification token
    newUser.verificationToken = crypto.randomBytes(32).toString("hex");

    console.log("User object before saving:", newUser);
    // save the user
    await newUser.save();
    // send verification email
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res.status(200).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    console.log("Error registering user", err);
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "feboapong@gmail.com",
      pass: "Klasique1",
    },
  });
  const mailOPtions = {
    from: "quirkyquest.com",
    to: email,
    subject: "Verify your email",
    text: `Click on the link below to verify your email: http://localhost:3000/verify/${verificationToken}`,
  };

  // send the email
  try {
    await transporter.sendMail(mailOPtions);
    console.log("Email sent");
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

// verify user
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    // find user with the verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid verification token: User not found" });
    }
    // update user
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "User verified" });
  } catch (error) {
    console.log("Error verifying user", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

// generate secrete key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

//endpoint to login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found: Invalid email or password" });
    }

    // check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "login failed" });
    console.error("Error logging in user:", error);
  }
});

//  endpoint to select or change gender for a particular user
app.put("/users/:userId/gender", async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { gender: gender },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User gender updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user gender", error });
  }
});

//   endpoint to update user description (the about me section)
app.put("/users/:userId/description", async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;

    console.log(`Received PUT request to update description for user ${userId}`);
    console.log(`New description: ${description}`);

    const user = await User.findByIdAndUpdate(
      userId,
      { description: description },
      { new: true }
    );

    if (!user) {
        console.log(`User with ID ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User description updated successfully for user ${userId}`);
    return res
      .status(200)
      .json({ message: "User description updated successfully" });
  } catch (error) {
    console.log("Couldn't update user description", error);
    res.status(500).json({ message: "Error updating user description" });
  }
});

// fetch user's data
app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error fetching user data", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// endpoint to add user's turn-ons
app.put("/users/:userId/turn-ons/add", async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { turnOns: turnOn } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User turn-ons added successfully", user });
  } catch (error) {
    console.log("Error adding user turn-ons", error);
    res.status(500).json({ message: "Error adding user turn-ons" });
  }
});

// endpoint to remove user's turn-ons
app.put("/users/:userId/turn-ons/remove", async (req, res) => {
    try {
        const { userId } = req.params;
        const { turnOn } = req.body;
    
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { turnOns: turnOn } },
            { new: true }
        );
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        return res.status(200).json({ message: "User turn-ons removed successfully", user });
        } catch (error) {
        console.log("Error removing user turn-ons", error);
        res.status(500).json({ message: "Error removing user turn-ons" });
    }
});

// endpoint to add looking for
app.put("/users/:userId/looking-for",async (req, res)=>{
  try{
    const {userId} = req.params;
    const {lookingFor} = req.body;

    const user = await User.findByIdAndUpdate(userId, {$addToSet: {lookingFor: lookingFor}}, {new: true});

    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    return res.status(200).json({message: "User looking-for added successfully", user});
  } catch (error) {
    console.log("Error adding user looking-for", error);
    res.status(500).json({ message: "Error adding user looking-for" });
  }
})

//endpoint to remove looking for in the backend
app.put("/users/:userId/looking-for/remove", async (req, res) => { 
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { lookingFor: lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user" });
    }

    return res
      .status(200)
      .json({ message: "Looking for updated successfully".user });
  } catch (error) {
    res.status(500).json({ message: "Error removing looking for", error });
  }
});

// endpoint for the user profile images
app.post("/users/:userId/profile-images", async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImages.push(imageUrl);

    await user.save();

    return res.status(200).json({ message: "Image has been added", user });
  } catch (error) {
    res.status(500).json({ message: "Error adding the profile images" });
  }
});

//endpoint to fetch all the profiles for a particular user
app.get("/profiles", async (req, res) => {
  const { userId, gender, turnOns, lookingFor } = req.query;

  try {
    let filter = { gender: gender === "male" ? "female" : "male" }; // For gender filtering

    // Add filtering based on turnOns and lookingFor arrays
    if (turnOns) {
      filter.turnOns = { $in: turnOns };
    }

    if (lookingFor) {
      filter.lookingFor = { $in: lookingFor };
    }

    const currentUser = await User.findById(userId)
      .populate("matches", "_id")
      .populate("crushes", "_id");

    // Extract IDs of friends (people the user has matched with)
    const friendIds = currentUser.matches.map((friend) => friend._id);

    // Extract IDs of crushes
    const crushIds = currentUser.crushes.map((crush) => crush._id);

    const profiles = await User.find(filter)
      .where("_id")
      .nin([userId, ...friendIds, ...crushIds]);

    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profiles", error });
  }
});

//endpoint to send a friend request (like)
app.post("/send-like", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recepient's friendRequestsArray!
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { receivedCrushes: currentUserId },
    });
    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { crushes: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});