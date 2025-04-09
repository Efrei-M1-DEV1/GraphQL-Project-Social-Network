import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required in production");
  }
  return secret;
}

const JWT_SECRET = getSecret();

export interface TokenPayload {
  userId: number;
  jti?: string;
}

export const generateToken = (userId: number): string => {
  return jwt.sign(
    {
      userId,
      tokenType: "access",
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
      jwtid: uuidv4(),
    },
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload & { tokenType?: string };

    // Validate it's actually an access token
    if (payload.tokenType !== "access") {
      throw new Error("Invalid token type: Not an access token");
    }

    return payload;
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign(
    {
      userId,
      tokenType: "refresh",
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
      jwtid: uuidv4(),
    },
  );
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload & { tokenType?: string };

    // Validate it's actually a refresh token
    if (payload.tokenType !== "refresh") {
      throw new Error("Invalid token type: Not a refresh token");
    }

    return payload;
  } catch (error) {
    throw new Error(`Refresh token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
