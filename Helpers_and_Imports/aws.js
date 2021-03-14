// Imports and Variables 
import {awsSdkS3 , multerS3, multer} from './libs_required.js';

// Config options for AWS
const s3 = new awsSdkS3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Setting up my storage object 
const awsUploader  = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: (req,file , cb) => {
            cb(null , Date.now().toString())
        }
    })
})


// Exporting the storage object on s3
export { awsUploader, s3 }

