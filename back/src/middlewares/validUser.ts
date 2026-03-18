import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Adjust AuthPayload to match what the middleware actually attaches,
// and keep optional fields for any other places that expect them.
export interface AuthPayload {
  id: string;
  mobileNo: string;
  username?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// Export middleware as RequestHandler so Express types accept it.
export const authMiddleware: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
