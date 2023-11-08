const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./auth/authRoutes');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

const UrlModel = require('./models/UrlModel');

app.get('/:code', async (req, res) => {
    try {
        const url = await UrlModel.findOne({ urlCode: req.params.code });
        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
