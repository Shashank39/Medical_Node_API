import { Request, Response } from 'express';
import Address from "../models/address"; // Assuming you're using a default export
import User from "../models/user"; // Assuming you're using a default export
import bcrypt from 'bcrypt'; // Ensure bcrypt is imported
import { addToBlacklist } from "../utils/tokenBlacklist";

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
    user: {
      id: string;
    };
  }
// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().select('-password');
    return res.json(users);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// Get user details
export const getUserDetails = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id)
      .populate('addresses') // Populate the addresses field
      .select("-password");  // Exclude the password field

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Update user details
export const updateUserDetails = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, shopName } = req.body;
  const userFields = { name, email, shopName };

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select("-password");

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Delete user
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Change password
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Compare the current password with the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Directly set the new password from the frontend (assumed to be hashed)
    user.password = await bcrypt.hash(newPassword, 10); // Hash the new password before saving

    await user.save();

    return res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Add address
export const addAddress = async (req: Request, res: Response): Promise<Response> => {
  const { userId, houseNo, street, city, state, postalCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newAddress = new Address({
      houseNo,
      street,
      city,
      state,
      postalCode,
      user: userId,
    });

    const savedAddress = await newAddress.save();

    user.addresses.push(savedAddress._id);
    await user.save();

    return res.json(savedAddress);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Update address
export const updateAddress = async (req: Request, res: Response): Promise<Response> => {
  const { houseNo, addressId, street, city, state, postalCode } = req.body;

  try {
    let address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ msg: 'Address not found' });
    }

    address.street = street || address.street;
    address.houseNo = houseNo || address.houseNo;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;

    const updatedAddress = await address.save();

    return res.json(updatedAddress);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// Delete address
export const deleteAddress = async (req: Request, res: Response): Promise<Response> => {
  const { addressId, userId } = req.params;

  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ msg: 'Address not found' });
    }

    await address.deleteOne();

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: addressId } },
      { new: true }
    );

    return res.json({ msg: 'Address removed', addresses: user?.addresses });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// Logout
export const logout = (req: Request, res: Response): Response => {
  const token = req.header("token");
  addToBlacklist(token);
  return res.json({ msg: "User logged out" });
};
