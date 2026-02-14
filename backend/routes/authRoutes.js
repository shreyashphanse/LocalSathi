import express from "express";
import {
  registerClient,
  registerLabour,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/client", registerClient);
router.post("/register/labour", registerLabour);
router.post("/login", loginUser);

export default router;
