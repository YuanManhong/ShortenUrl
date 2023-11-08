const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

//register
exports.register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        console.log(req.body.username);


        const newUser = await UserModel.create({
            username: req.body.username,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Login user and return a JWT
exports.login = async (req, res) => {
    try {
        // Find the user by username
        const user = await UserModel.findOne({ username: req.body.username });

        // Check if user exists and password is correct
        const isPasswordValid = user && await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create JWT payload
        const payload = {
            id: user._id,
            username: user.username,
        };

        // Sign the JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d' // Expires in one day
        });

        // Respond with the JWT
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}