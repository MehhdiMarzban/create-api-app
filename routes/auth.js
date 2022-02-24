import express from "express";
import {register, login, logout, currentUser} from "../controllers/auth";
import { requireSignIn } from "../middlewares";

//* make router middleware
const router = express.Router();

//* routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignIn, currentUser);

module.exports = router;