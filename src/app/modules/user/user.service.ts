import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TUser } from './user.interface';
import config from '../../config';
import { UserModel } from './user.model';
import { sendEmail } from '../../utils/sendEmail';

// Sign-Up Function
const createUser = async (user: TUser) => {
  if (!user.password) {
    throw new Error('Password is required');
  }

  const hashedPassword = await hash(user.password, 10); // Hash the password
  const result = await UserModel.create({ ...user, password: hashedPassword });

  const jwtPayload = {
    userId: result._id,
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_token_secret as string,
    {
      expiresIn: config.jwt_access_expires_in, // Use it inside the options object
    },
  );

  return { result, accessToken };
};

// Sign-In Function
const signIn = async (email: string, password: string) => {
  // Fetch user by email
  const user = await UserModel.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Ensure password is defined
  if (!password || !user.password) {
    throw new Error('Password is required');
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  // Sign access token
  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_token_secret as string,
    { expiresIn: config.jwt_access_expires_in }, // Correct usage of options
  );

  // Sign refresh token
  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expires_in }, // Correct usage of options
  );

  return { user, accessToken, refreshToken };
};

// Change Password Function
// Assuming you have a UserModel

const forgetPassword = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  // Sign access token
  const resetToken = jwt.sign(
    jwtPayload,
    config.jwt_access_token_secret as string,
    { expiresIn: '10m' }, // Correct usage of options
  );
  const resetUiLink = `http://localhost:5000/id=${user._id}&token=${resetToken}`;

  sendEmail();
  console.log(resetUiLink);
};

const refreshToken = async (token: string) => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as jwt.JwtPayload;

    const { userId } = decoded;

    // Find the user associated with the token
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create a new access token
    const jwtPayload = {
      userId: user._id,
      role: user.role,
    };

    const accessToken = jwt.sign(
      jwtPayload,
      config.jwt_access_token_secret as string,
      { expiresIn: config.jwt_access_expires_in }, // Set token expiry
    );

    // Return the new access token
    return { accessToken };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
const getAllUser = async () => {
  const users = await UserModel.find();
  return users;
};
const getUser = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user;
};
const getAdmin = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user;
};
const updateUser = async (userId: string, user: TUser) => {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, user, {
    new: true,
  });
  return updatedUser;
};

const updateUserRole = async (userId: string, role: string) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { role },
    {
      new: true,
      runValidators: true, // Optional: applies validation on the update
    },
  );
  return updatedUser;
};
export const UserServices = {
  createUser,
  signIn,
  forgetPassword,
  refreshToken,
  getUser,
  updateUser,
  getAdmin,
  getAllUser,
  updateUserRole,
};
