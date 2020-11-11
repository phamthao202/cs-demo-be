const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
//test the email from Mailgun
// const sendTestEmail = () => {
//   const data = {
//     from:
//       "Mailgun Sandbox <postmaster@sandboxf892f174a178454399ad3b7e895c0a13.mailgun.org>",
//     to: "phamthao202@gmail.com",
//     subject: "Hello",
//     text: "Testing some Mailgun awesomeness!",
//   };
//   mg.messages().send(data, function (error, body) {
//     console.log(body);
//   });
// };

//function to send  the verification code to MailGun serve and MailGun send to User a verification code under a LINK TYPE
const sendVerificationEmail = (user) => {
  const data = {
    from:
      "Mailgun Sandbox <postmaster@sandbox0e6a67af4f4b40bfba4ded3913377b10.mailgun.org>",
    to: user.email,
    subject: "Please Verify Your Email Address",
    template: "verify_email",

    "v:verification_link": `${process.env.FRONTEND_URL}verify/${user.emailVerificationCode}`,
    "v:name": user.name,
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
};
module.exports = {
  //   sendTestEmail,
  sendVerificationEmail,
};
