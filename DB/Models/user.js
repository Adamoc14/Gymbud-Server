// Setting up my User Schema
import { mongoose } from '../connection.js';
const userSchema = new mongoose.Schema({
    Username: String,
    Password: String,
    Profile_Url : String,
    Name: String,
    Gender: String,
    DOB: String,
    Preferred_Intensity: String,
    Fitness_Level: String,
    Resources: [String],
    Activities_Enjoyed: [String],
    Preferred_Age_Range: String,
    Preferred_Distance_Range: String,
    Video_Or_In_Person: String,
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
user = mongoose.model("User", userSchema)
export { user }
