const sendgrid = require('@sendgrid/mail');
const { sendGridApiKey, emailFrom, emailSubject } = require('../config/config');

sendgrid.setApiKey(sendGridApiKey);

module.exports = (email, verificationLink) => {
    const message = {
        to: email,
        from: emailFrom,
        subject: emailSubject,
        text: `Please verify your email by clicking the following link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking the following link:</p><a href="${verificationLink}">Verify Email</a>`,
        tracking_settings: {
            click_tracking: { enable: true, enable_text: true },
        },
    };

    sendgrid
        .send(message)
        .then(() => console.log('Verification email sent successfully!'))
        .catch((error) => console.error('Error sending email:', error));
};
