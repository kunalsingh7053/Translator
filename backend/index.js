const sendEmail = require("./src/service/email.service");


sendEmail("sc23cs301075@medicaps.ac.in", "Test Email Subject", "This is a test email sent with Nodemailer using OAuth2.", "<p>This is a test email sent with <b>Nodemailer</b> using OAuth2.</p>");