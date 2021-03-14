// Setting up my User Schema
import { mongoose } from '../connection.js';
import { Joi } from "../../Helpers_and_Imports/libs_required.js";

// Declaring our Schemas for Validation but also for use of the mongoose Models
const userSchema = new mongoose.Schema({
    Username: String,
    Email: String,
    Password: String,
    Profile_Url : String,
    Name: String,
    Gender: String,
    DOB: String,
    Fitness_Level: String,
    Preferred_Intensity: String,
    Preferred_Age_Range: String,
    Preferred_Distance_Range: String,
    Resources: [String],
    Outdoor_Activities_Enjoyed: [String],
    Messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Buds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity"
    }]
}),

//Joi Documentation for Schemas - https://joi.dev/api/?v=17.4.0
userValidationSchema = Joi.object().keys({
    Username: Joi.string().trim().required(),
    Email: Joi.string().trim().required(),
    Password: Joi.string().trim().required(),
    Profile_Url: Joi.string().trim().required(),
    Name: Joi.string().trim().required(),
    Gender: Joi.string().trim().required(),
    DOB: Joi.string().trim().required(),
    Fitness_Level: Joi.string().trim().required(),
    Preferred_Intensity: Joi.string().trim().required(),
    Preferred_Age_Range: Joi.string().trim().required(),
    Preferred_Distance_Range: Joi.string().trim().required(),
    Resources: Joi.array().items(Joi.string()).required(),
    Outdoor_Activities_Enjoyed: Joi.array().items(Joi.string()),
    Messages: Joi.array().items(Joi.string()),
    Buds: Joi.array().items(Joi.string()),
    Activities: Joi.array().items(Joi.string())
}),

user = mongoose.model("User", userSchema)

export { user , userValidationSchema }
