const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchUser');


let success = false;
//Create a user usign post ========== ROUTE 1 ========================
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be at least 5 character').isLength({ min: 5 }),
], async (req, res) => {
    
    //Returning bad request of error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({success, error: errors.array()[0].msg });
    }

    // chekc  wheter the user exists with this email already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            success = false;
            return res.status(400).json({success, error: "A user with this Email already exists" })
        }
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //creating user and inserting into database
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }

        //Generating and sending authtoken
        const JWT_SECRET = process.env.JWT_SECRET;
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success,authtoken});
        

    } catch (error) {
        console.error(error.message);
        success = false;
        res.status(500).send({success, error:"Internal server error occured. Try again!"});
    }
})

//Authnticating a user on /api/auth/login  ========== ROUTE 2 ========================
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    //Returning bad request of error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: error.array()[0].msg });
    }

    const { email, password } = req.body;
    try {

        //matchig email
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({success, error: "Invalid Credentials" });
        }

        //macthing password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({success, error: "Invalid Credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        //Generating and sending authtoken
        const JWT_SECRET = process.env.JWT_SECRET;
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured. Try again!");
    }
})

//Get logedin using user details: POST "/api/auth/getuser" .  ========== ROUTE 3 ========================
router.post('/getuser',fetchuser,async (req, res) => {
try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);

}
catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured. Try again!");
}
})

module.exports = router;