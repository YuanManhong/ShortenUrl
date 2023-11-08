const { generateShortUrl } = require('../services/urlShortener');
const UrlModel = require('../models/UrlModel');

exports.shortenUrl = async (req, res) => {
    try {
        // The original URL to be shortened is expected to be in the request body
        const { originalUrl } = req.body;
        const userId = req.user.id; // The user's ID should be attached to req.user by your authentication middleware

        // Call the generateShortUrl service to create a short URL
        const url = await generateShortUrl(originalUrl, userId);

        // Respond with the shortened URL
        res.status(201).json({
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            urlCode: url.urlCode
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating short URL", error: error.message });
    }
};

exports.getUserUrls = async (req, res) => {
    const urls = await UrlModel.find({ createdBy: req.user.id });
    res.json(urls);
};
