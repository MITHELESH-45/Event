import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer (required for Cloudinary upload)
const storage = multer.memoryStorage();

// Init upload - store in memory
const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (_req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Error: Images only! (jpeg, jpg, png, gif, webp)'));
        }
    }
}).single('image');

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Public
router.post('/', (req: express.Request, res: express.Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(400).json({ message: err?.message || String(err) || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file selected!' });
        }

        // Validate Cloudinary config
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return res.status(500).json({ message: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env' });
        }

        try {
            const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'event-banners' },
                    (error, result) => {
                        if (error) reject(error);
                        else if (result) resolve(result);
                        else reject(new Error('Upload failed'));
                    }
                );
                uploadStream.end(req.file!.buffer);
            });

            res.json({
                message: 'File uploaded successfully!',
                file: uploadResult.secure_url
            });
        } catch (uploadError: any) {
            console.error('Cloudinary upload error:', uploadError);
            res.status(500).json({
                message: uploadError?.message || 'Failed to upload image to cloud storage'
            });
        }
    });
});

export default router;
