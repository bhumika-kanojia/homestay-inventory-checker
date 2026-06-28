import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import 'dotenv/config';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// console.log(process.env.GOOGLE_CLIENT_ID)
/**
 * @desc    Verify Google credential and issue JWT
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400);
      throw new Error('Google credential is required');
    }

    // Verify the Google ID token
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      res.status(401);
      throw new Error('Invalid Google credential. Verification failed.');
    }

    const { sub: googleId, email, name, picture: photo } = payload;

    if (!email) {
      res.status(400);
      throw new Error('Could not retrieve email from Google account');
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, photo });
    } else if (!user.googleId) {
      // Attach googleId if user exists but logged in differently before
      user.googleId = googleId;
      if (photo) user.photo = photo;
      await user.save();
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500);
      throw new Error('JWT_SECRET is not configured on the server');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo || null
      }
    });

  } catch (error) {
    next(error);
  }
};
