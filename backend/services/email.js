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
