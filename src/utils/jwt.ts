import jwt from "jsonwebtoken";
interface Payload {
  id: number;
  username: string;
  email: string;
  admin: boolean;
}

export function validateToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload as Payload;
  } catch (error) {
    return null;
  }
}

export const signToken = (payload: Payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET || "");
  return token;
};
