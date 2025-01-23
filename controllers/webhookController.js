exports.webhook = (req, res) => {
    const events = req.body;

    events.forEach(event => {
        if (event.event === 'click') {
            console.log(`Email with subject "${event.subject}" was clicked!`);
            console.log(`URL clicked: ${event.url}`);
            console.log(`Recipient: ${event.email}`);
        }
    });

    res.status(200).send('Event received');
};
