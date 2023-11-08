const UrlModel = require('../models/UrlModel');

const baseUrl = process.env.BASE_URL;
console.log("111");
const generateShortUrl = async (originalUrl, userId) => {
    // Generate a unique URL code
    const { nanoid } = await import('nanoid');
    const urlCode = nanoid();

    // Construct the short URL
    const shortUrl = `${baseUrl}/${urlCode}`;

    // Create a new URL document
    const newUrl = new UrlModel({
        originalUrl,
        shortUrl,
        urlCode,
        createdBy: userId
    });

    // Save the URL document to the database
    await newUrl.save();

    // Return the new URL document
    return newUrl;
};

module.exports = {
    generateShortUrl,
};
