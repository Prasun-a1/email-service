const sendgrid = require('@sendgrid/mail');
const { sendGridApiKey, emailFrom, emailSubject } = require('../config/config');

sendgrid.setApiKey(sendGridApiKey);

module.exports = (email, organization, role) => {
    const registrationUrl = `${process.env.FRONTEND_URL}?email=${encodeURIComponent(email)}&organization=${encodeURIComponent(organization)}&role=${encodeURIComponent(role)}`;

    const message = {
        to: email,  // Recipient's email
        from: emailFrom,  // Your verified SendGrid email
        subject: `Invitation to join ${organization} as ${role}`,
        text: `Hello,
  
      You have been invited to join ${organization} as a ${role}. 
      Please follow the link to complete your registration.
  
      ${registrationUrl}
      Best regards,
      The ${organization} Team`,
        html: `<p>Hello,</p>
             <p>You have been invited to join <strong>${organization}</strong> as a <strong>${role}</strong>.</p>
             <p>Please follow the link to complete your registration.</p>
             <p><a href="${registrationUrl}">Complete Registration</a></p>
             <p>Best regards,<br/>The ${organization} Team</p>`,
    };

    sendgrid
        .send(message)
        .then(() => console.log('Invitation email sent successfully!'))
        .catch((error) => console.error('Error sending email:', error));
};