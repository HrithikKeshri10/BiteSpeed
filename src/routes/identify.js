import express from "express";
import ContactController from "../controllers/contactController.js";

const router = express.Router();

router.post("/", ContactController.identify);
router.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Send Post request to API endpoint - https://bite-speed-tau.vercel.app/api/identify",
  });
});

export default router;
