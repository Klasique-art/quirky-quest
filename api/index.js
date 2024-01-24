const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');
const User = require('./models/user');

mongoose.connect("mongodb+srv://felix:felix@cluster0.ng5szdk.mongodb.net/").then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
        console.log(err);
    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// endpoint to register a user
app.post('/register', async(req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        // create a new user
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name, 
            email, 
            password
        });

        // generate a verification token
        newUser.verificationToken = crypto.randomBytes(32).toString('hex');

        // save the user
        await newUser.save();
        // send verification email
        sendVerificationEmail(newUser.email, newUser.verificationToken);
    } catch (err) {
        console.log("Error registering user",err);
        res.status(500).json({message: "Registration failed"});
    }
});

const sendVerificationEmail = async(email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "feboapong@gmail.com",
            pass: "Klasique1"
        }
    });
    const mailOPtions = {
        from: "quirkyquest.com",
        to: email,
        subject: "Verify your email",
        text: `Click on the link below to verify your email: http://localhost:3000/verify/${verificationToken}`
    };

    // send the email
    try {
        await transporter.sendMail(mailOPtions);
    } catch (error) {
        console.log("Error sending verification email", error);
    }

}

// verify user
app.get('/verify/:token', async(req, res) => {
    try {
        const token = req.params.verificationToken
        // find user with the verification token
        const user = await User.findOne({ verificationToken : token});
        if(!user) {
            return res.status(404).json({message: "Invalid verification token: User not found"});
        }
        // update user
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({message: "User verified"});
    } catch (error) {
        console.log("Error verifying user", error);
        res.status(500).json({message: "Verification failed"});
    }
});