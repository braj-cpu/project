import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

import {upload} from "../middlewares/multer.middleware.js"
const router = Router();
//app.js se yha puchne ayega ki kis route me le jana h
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])//its a middleware
    ,registerUser);

export default router;

//this default enbles to rename it while

