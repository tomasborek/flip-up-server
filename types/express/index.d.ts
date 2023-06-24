import { CurrentUser } from "@interfaces/currentUser";
declare global {
  namespace Express {
    export interface Request {
      user?: CurrentUser;
    }
  }
}
