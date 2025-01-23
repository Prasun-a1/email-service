require('dotenv').config();
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const message = {
    to: 'prasun98.pm@gmail.com', // Change this to your actual email
    from: process.env.EMAIL_FROM,  // Make sure this email is verified in SendGrid
    subject: 'Test Email',
    text: 'This is a test email from SendGrid.',
};

sendgrid
    .send(message)
    .then(() => {
        console.log('Test email sent successfully!');
    })
    .catch((error) => {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SendGrid error response:', error.response.body);
        }
    });
