const mongoose = require('mongoose');
const { mailSender } = require('../utils/mailSender');
const otpTemplate = require('../mailTemplates/otpVerification');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});
// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from EatEasy",
      otpTemplate(otp),
    )
      .then((result) => console.log('Email sent...', result))
      .catch((error) => console.log(error.message));
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
    console.log("Email: ", this.email)
  }
  next();
});
module.exports = mongoose.model("OTP", otpSchema);
