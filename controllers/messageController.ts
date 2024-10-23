import { Request, Response } from 'express';
import Message from '../models/message';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com', 
  port: 465,
  secure: true,
  auth: {
    user: "devdoodleslearner@gmail.com",
    pass: "omosbcwpsmslqacn",
  },
});

export const getInTouch = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, message, phone } = req.body;

  try {
 
    const newMessage = new Message({ name, email, message, phone });
    await transporter.sendMail({
      to: 'devdoodleslearner@gmail.com',
      subject: 'Hi, I need to connect',
      text: `User Details are Name: ${name}, Email: ${email}, Message: ${message}, Phone: ${phone}.`,
    });

    await newMessage.save();

    return res.status(201).json({ msg: 'Message sent successfully!' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
