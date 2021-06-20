const nodemailer = require("nodemailer");

module.exports = ({
  async remindPassword({ nickname, email, password }) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS,
      }
    });

    await transporter.sendMail({
      from: "redditmicro@gmail.com",
      to: `${email}`,
      subject: "Password reminder",
      text: `Hello ${nickname}!\n\nYour password is ${password}`
    });

    transporter.close();
  }
});

// module.exports = ({
//   async remindPassword({ nickname, email, password }) {
//     const testAccount = await nodemailer.createTestAccount();

//     const transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: testAccount.user, // generated ethereal user
//         pass: testAccount.pass, // generated ethereal password
//       },
//     });

//     const info = await transporter.sendMail({
//       from: "\"MicroReddit Support\" <no-reply@microreddit.com>",
//       to: `${email}`,
//       subject: "Password reminder",
//       text: `Hello ${nickname}! Your password is ${password}`
//     });

//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   }
// });
