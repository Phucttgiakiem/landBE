import { authMiddleWare } from "./authMiddleware";

export const auth = authMiddleWare();
export const isAdmin = authMiddleWare(["admin"]);
export const isSeller = authMiddleWare(["seller", "admin"]);

