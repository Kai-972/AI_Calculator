import express from 'express';
import { analyzeImage } from './utils.js';
import { ImageDataSchema } from '../../schema.js'; // Import the schema for validation
import sharp from 'sharp'; // Import sharp for image processing

const router = express.Router();

// Route to handle the image analysis
router.post("/", async (req, res) => {
  try {
    const { error, value } = ImageDataSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "Validation failed", errors: error.details });
    }

    const { image, dict_of_vars } = value;

    // Extract base64 data and MIME type
    const base64Data = image.split(",")[1]; // Decode after "data:image/<type>;base64,"
    const mimeType = image.match(/^data:(.+);base64/)[1]; // Extract MIME type
    const imageBuffer = Buffer.from(base64Data, "base64"); // Decode base64 to binary buffer

    // Optional: Process the image using sharp for resizing or validation
    const processedImage = await sharp(imageBuffer)
      .resize({ width: 500 }) // Resize to a max width of 500px
      .toBuffer(); // Convert back to a buffer

    // Analyze the image
    const responses = await analyzeImage(processedImage, dict_of_vars);

    return res.status(200).json({
      message: "Image processed successfully",
      data: responses,
      status: "success",
    });
  } catch (error) {
    console.error("Error in /calculate route:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: "failure",
      error: error.message,
    });
  }
});


export { router };
