const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
  <div style="
    font-family: Arial;
    background: #0f172a;
    color: white;
    padding: 30px;
    border-radius: 10px;
  ">
    <h1 style="color:#22c55e;">Welcome ${name} 💪</h1>
    <p>
      You’ve taken the first step toward <b>discipline & consistency</b>.
    </p>

    <div style="
      background:#1e293b;
      padding:20px;
      border-radius:8px;
      margin-top:20px;
    ">
      <h3>🔥 Remember</h3>
      <p>Small steps every day create massive results.</p>
    </div>

    <p style="margin-top:30px;">
      Stay consistent,<br/>
      <b>Daily Workout Streak Team</b>
    </p>
  </div>
  `;

  await transporter.sendMail({
    from: `"Daily Streak 💪" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Daily Workout Streak 🚀",
    html,
  });
};

module.exports = sendWelcomeEmail;
