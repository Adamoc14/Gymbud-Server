// Imports and Variables 
import {cloudinary, CloudinaryStorage, crypto, multer} from './libs_required.js';

// Config options for cloudinary 
const cloudinaryConfig = cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Setting Up my storage object
const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Gymbud_Uploads',
        format: async (req, file) => 'png',
        public_id: (req, file) => {
            let buf = crypto.randomBytes(16);
            buf = buf.toString('hex');
            let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
            uniqFileName += buf;

            return uniqFileName
        },
    },
});

// Using Multer to set up my storage place for objects to go
const upload = multer({ storage: cloudStorage });

// Exporting config and storage place 
export  {cloudinaryConfig, upload}


