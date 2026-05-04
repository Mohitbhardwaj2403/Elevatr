import { Router } from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/atsController.js";

const router = Router();
const upload = multer();

router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;
