require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    baseUrl: process.env.BASE_URL,
    emailFrom: process.env.EMAIL_FROM,
    emailSubject: process.env.EMAIL_SUBJECT,
};
