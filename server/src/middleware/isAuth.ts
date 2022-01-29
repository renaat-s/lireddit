import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    if (!context.req.session.UserId) {
      throw new Error("not authenticated");
    }
  
    return next();
  };