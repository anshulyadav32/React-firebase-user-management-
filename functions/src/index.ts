import {onRequest, onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as jwt from "jsonwebtoken";
import * as nodemailer from "nodemailer";

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Types
interface LoginRequest {
  idToken: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  user: any;
}

// Helper function to verify Firebase ID token
const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error("Error verifying ID token:", error);
    throw new Error("Invalid or expired token");
  }
};

// Helper function to get user by UID
const getUserByUid = async (uid: string) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    logger.error("Error fetching user:", error);
    throw new Error("User not found");
  }
};

// Login function
export const login = onRequest({cors: true}, async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({
        success: false,
        message: "Method not allowed",
        error: "METHOD_NOT_ALLOWED",
      });

      return;
    }

    const {idToken} = request.body as LoginRequest;

    if (!idToken) {
      const apiResponse: ApiResponse = {
        success: false,
        message: "ID token is required",
        error: "MISSING_TOKEN",
      };
      response.status(400).json(apiResponse);
      return;
    }

    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(idToken);

    // Get user details
    const userRecord = await getUserByUid(decodedToken.uid);

    // Create custom JWT token
    const jwtPayload = {
      uid: userRecord.uid,
      email: userRecord.email,
      phoneNumber: userRecord.phoneNumber,
    };

    const jwtSecret = process.env.JWT_SECRET || "fallback-secret";
    const accessToken = jwt.sign(jwtPayload, jwtSecret, {
      expiresIn: "24h",
    });

    const user = {
      uid: userRecord.uid,
      email: userRecord.email,
      phoneNumber: userRecord.phoneNumber,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime ||
          userRecord.metadata.creationTime,
      },
      customClaims: userRecord.customClaims,
      providerData: userRecord.providerData,
    };

    const tokenResponse: TokenResponse = {
      accessToken,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
      user,
    };

    const apiResponse: ApiResponse<TokenResponse> = {
      success: true,
      message: "Login successful",
      data: tokenResponse,
    };

    response.status(200).json(apiResponse);
  } catch (error) {
    logger.error("Login error:", error);
    const apiResponse: ApiResponse = {
      success: false,
      message: "Login failed",
      error: "AUTHENTICATION_FAILED",
    };
    response.status(401).json(apiResponse);
  }
});

// Get user profile function
export const getProfile = onCall({cors: true}, async (request) => {
  try {
    if (!request.auth) {
      throw new Error("User not authenticated");
    }

    const userRecord = await getUserByUid(request.auth.uid);

    const user = {
      uid: userRecord.uid,
      email: userRecord.email,
      phoneNumber: userRecord.phoneNumber,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime ||
          userRecord.metadata.creationTime,
      },
      customClaims: userRecord.customClaims,
      providerData: userRecord.providerData,
    };

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    };
  } catch (error) {
    logger.error("Get profile error:", error);
    throw new Error("Failed to retrieve profile");
  }
});

// Update user profile function
export const updateProfile = onCall({cors: true}, async (request) => {
  try {
    if (!request.auth) {
      throw new Error("User not authenticated");
    }

    const {displayName, photoURL} = request.data;
    const updateData: any = {};

    if (displayName !== undefined) {
      updateData.displayName = displayName;
    }
    if (photoURL !== undefined) {
      updateData.photoURL = photoURL;
    }

    // Update user in Firebase
    const updatedUser = await admin.auth().updateUser(
      request.auth.uid,
      updateData
    );

    const user = {
      uid: updatedUser.uid,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      displayName: updatedUser.displayName,
      photoURL: updatedUser.photoURL,
      emailVerified: updatedUser.emailVerified,
      disabled: updatedUser.disabled,
      metadata: {
        creationTime: updatedUser.metadata.creationTime,
        lastSignInTime: updatedUser.metadata.lastSignInTime ||
          updatedUser.metadata.creationTime,
      },
      customClaims: updatedUser.customClaims,
      providerData: updatedUser.providerData,
    };

    return {
      success: true,
      message: "Profile updated successfully",
      data: user,
    };
  } catch (error) {
    logger.error("Update profile error:", error);
    throw new Error("Failed to update profile");
  }
});

// Delete user account function
export const deleteAccount = onCall({cors: true}, async (request) => {
  try {
    if (!request.auth) {
      throw new Error("User not authenticated");
    }

    // Delete user from Firebase
    await admin.auth().deleteUser(request.auth.uid);

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error) {
    logger.error("Delete account error:", error);
    throw new Error("Failed to delete account");
  }
});

// Set custom claims function (admin only)
export const setCustomClaims = onCall({cors: true}, async (request) => {
  try {
    if (!request.auth) {
      throw new Error("User not authenticated");
    }

    // Check if user has admin privileges
    const userRecord = await getUserByUid(request.auth.uid);
    if (!userRecord.customClaims?.admin) {
      throw new Error("Insufficient permissions");
    }

    const {uid, customClaims} = request.data;

    if (!uid || !customClaims) {
      throw new Error("UID and custom claims are required");
    }

    await admin.auth().setCustomUserClaims(uid, customClaims);

    return {
      success: true,
      message: "Custom claims set successfully",
    };
  } catch (error) {
    logger.error("Set custom claims error:", error);
    throw new Error("Failed to set custom claims");
  }
});

// Health check function
export const healthCheck = onRequest(
  {cors: true},
  async (request, response) => {
    try {
      response.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      });
    } catch (error) {
      logger.error("Health check error:", error);
      response.status(500).json({
        success: false,
        message: "Server health check failed",
        error: "HEALTH_CHECK_FAILED",
      });
    }
  });

// Email sending function
export const sendEmail = onCall({cors: true}, async (request) => {
  try {
    // Verify user is authenticated
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    const {to, subject, text} = request.data;

    if (!to || !subject || !text) {
      throw new Error("Missing required fields: to, subject, text");
    }

    // Create transporter (using Gmail for demo - replace with your SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "your-email@gmail.com",
        pass: process.env.GMAIL_PASS || "your-app-password",
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER || "your-email@gmail.com",
      to: to,
      subject: subject,
      text: text,
      html: `<p>${text.replace(/\n/g, "<br>")}</p>`,
    };

    const result = await transporter.sendMail(mailOptions);

    logger.info("Email sent successfully:", {
      messageId: result.messageId,
      to: to,
      subject: subject,
      user: request.auth.uid,
    });

    return {
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    };
  } catch (error: any) {
    logger.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
});
