import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBookingConfirmation = async (
  to: string,
  bookingDetails: {
    id: string;
    activityName: string;
    date: string;
    groupSize: number;
    totalPrice: number;
  }
) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Booking Confirmation - Party Pulse',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Thank you for booking with Party Pulse!</p>
      <h2>Booking Details:</h2>
      <ul>
        <li>Booking ID: ${bookingDetails.id}</li>
        <li>Activity: ${bookingDetails.activityName}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Group Size: ${bookingDetails.groupSize}</li>
        <li>Total Price: £${bookingDetails.totalPrice}</li>
      </ul>
      <p>We look forward to hosting you!</p>
    `,
  });
};

export const sendBookingReminder = async (
  to: string,
  bookingDetails: {
    activityName: string;
    date: string;
    location: string;
  }
) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Upcoming Booking Reminder - Party Pulse',
    html: `
      <h1>Booking Reminder</h1>
      <p>Your upcoming activity is tomorrow!</p>
      <h2>Details:</h2>
      <ul>
        <li>Activity: ${bookingDetails.activityName}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Location: ${bookingDetails.location}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `,
  });
};

export const sendLoyaltyUpdate = async (
  to: string,
  points: number,
  tier: string
) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Loyalty Program Update - Party Pulse',
    html: `
      <h1>Loyalty Program Update</h1>
      <p>Great news! Your loyalty status has been updated.</p>
      <h2>Your Status:</h2>
      <ul>
        <li>Points: ${points}</li>
        <li>Current Tier: ${tier}</li>
      </ul>
      <p>Keep booking to earn more rewards!</p>
    `,
  });
};