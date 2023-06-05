import { CurrentUser } from "src/interfaces";
declare global {
  namespace Express {
    export interface Request {
      user?: CurrentUser | null;
    }
  }
}
