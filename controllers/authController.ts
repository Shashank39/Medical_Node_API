import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/user';
import Address, { IAddress } from '../models/address';
import Otp from '../models/otp';

const otpStore: Record<string, string> = {};

// Transporter configuration for sending emails
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

// Register user
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, shopName, addresses } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role,
      shopName,
    });

    await user.save();


    if (addresses && addresses.length > 0) {
      const addressPromises = addresses.map(async (address: IAddress) => {
        const newAddress = new Address({
          ...address,
          user: user._id,
        });
        const savedAddress = await newAddress.save();
        return savedAddress._id;
      });

      const addressIds = await Promise.all(addressPromises);
      user.addresses = addressIds;
      await user.save();
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '6h' }, (err, token) => {
      if (err) throw err;
      res.json({ user, token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (password !== user.password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '6h' }, (err, token) => {
      if (err) throw err;

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    const otpInstance = new Otp({
      email,
      otp,
      expiresAt,
    });
    await otpInstance.save();

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`,
    });

    res.json({ msg: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Verify OTP and Change Password
export const verifyOtpAndChangePassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    const currentDate = new Date(); 
    if (currentDate > otp.expiresAt) {    
      return res.status(400).json({ msg: 'OTP has expired' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    await Otp.deleteOne({ email, otp });

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
