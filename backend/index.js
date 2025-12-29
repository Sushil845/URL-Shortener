import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import QRCode from "qrcode";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;

// 🔹 MongoDB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ DB connected successfully"))
  .catch((err) => console.log("❌ DB connection failed", err));

// 🔹 Schema
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

// 🔹 Create short URL
app.post("/api/short", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "originalUrl is required" });
    }

    const shortId = nanoid(8);
    const fullShortUrl = `${BASE_URL}/${shortId}`;

    const qrCodeImg = await QRCode.toDataURL(fullShortUrl);

    const newUrl = new Url({
      originalUrl,
      shortUrl: shortId,
    });

    await newUrl.save();

    res.status(200).json({
      message: "URL Generated",
      shortUrl: fullShortUrl,
      qrcodeImg: qrCodeImg,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Redirect route
app.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
