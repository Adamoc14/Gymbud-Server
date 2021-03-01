import {cloudinary, CloudinaryStorage, crypto, multer} from './libs_required.js';

const cloudinaryConfig = cloudinary.v2.config({
    cloud_name: 'aoc1153225218919518',
    api_key: '639167278639364',
    api_secret: process.env.CLOUDINARY_SECRET
});

const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: (req, file) => 'folder_name',
        format: async (req, file) => {
          // async code using `req` and `file`
          // ...
          return 'jpeg';
        },
        public_id: (req, file) => 'some_unique_id',
      },
    // params: async (req, file) => {
    //     let buf = crypto.randomBytes(16);
    //     buf = buf.toString('hex');
    //     let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
    //     uniqFileName += buf;
    //     return {
    //         format: async (req, file) => {
    //             "jpg", "png";
    //         }, 
    //         public_id: ( req , file )=> {
    //             return uniqFileName
    //         }
    //     };
    //   },
});

const upload = multer({ storage: cloudStorage });

export  {cloudinaryConfig, upload}


