const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');

//register
exports.register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        console.log(req.body.username);


        const newUser = await UserModel.create({
            username: req.body.username,
            password: hashedPassword,
            tier: req.body.tier || 'tier1',
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
            tier: savedUser.tier,
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
            tier: user.tier,
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
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Assumes Bearer token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: "Authorization header is required" });
    }
};