import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();
//app.js se yha puchne ayega ki kis route me le jana h
router.route("/register").post(registerUser);

export default router;

//this default enbles to rename it while

