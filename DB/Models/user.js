// Setting up my User Schema
import { mongoose } from '../connection.js';
import { Joi } from "../../Helpers_and_Imports/libs_required.js";

// Declaring our Schemas for Validation but also for use of the mongoose Models
const userSchema = new mongoose.Schema({
    Username: String,
    Password: String,
    Profile_Url : String,
    Name: String,
    Gender: String,
    DOB: String,
    Preferred_Intensity: String,
    Fitness_Level: String,
    Preferred_Age_Range: String,
    Preferred_Distance_Range: String,
    Video_Or_In_Person: String,
    Resources: [String],
    Activities_Enjoyed: [String],
    Messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Buds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    }]
}),

//Joi Documentation for Schemas - https://joi.dev/api/?v=17.4.0
userValidationSchema = Joi.object().keys({
    Username: Joi.string().trim().required(),
    Password: Joi.string().trim().required(),
    Profile_Url: Joi.string().trim().required(),
    Name: Joi.string().trim().required(),
    Gender: Joi.string().trim().required(),
    DOB: Joi.string().trim().required(),
    Preferred_Intensity: Joi.string().trim().required(),
    Fitness_Level: Joi.string().trim().required(),
    Preferred_Age_Range: Joi.string().trim().required(),
    Preferred_Distance_Range: Joi.string().trim().required(),
    Video_Or_In_Person: Joi.string().trim().required(),
    Resources: Joi.array().items(Joi.string()).required(),
    Activities_Enjoyed: Joi.array().items(Joi.string()).required(),
    Messages: Joi.array().items(Joi.string()),
    Buds: Joi.array().items(Joi.string()),
    Sessions: Joi.array().items(Joi.string())
}),

user = mongoose.model("User", userSchema)

export { user , userValidationSchema }
