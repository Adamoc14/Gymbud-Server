// Variable Declarations and Imports
import { express } from "../Helpers_and_Imports/libs_required.js"
import { activity , activityValidationSchema } from '../DB/Models/activity.js'
import { user } from '../DB/Models/user.js'
const activityRouter = express.Router()

// Joi schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

// Declaring array to carry my errors 
const errors = [];


//Router is mounted at /activities , all routes after this will be prefixed with this

// Setting up the activityRouter's routes


//_____Getting_All_Activities________
activityRouter.get("/", async(req,res) => {
    try {
        const activities = await activity.find({}).populate("Participants").populate("Creator");
        res.send(activities)
    } catch (error) {
        console.log(error)
    }
})

//____Creating_An_Activity___________
activityRouter.post("/" , async(req,res) => {
    try {
        const { error } = activityValidationSchema.validate(req.body, options);
        if( error) errors.push(error) && sendError(res , errors);
        else {
            const { Creator: {_id: Creator} , Time , Date , Location , Duration , Activity_Type , Activity_Name , Activity_Description , Activity_Gender_Preference , Budget_Level, Fitness_Level, Intensity_Level, Activity_Image_Url, Resources, Participants } = req.body;
            let createdActivity = await activity.create({Creator , Time , Date , Location , Duration , Activity_Type , Activity_Name , Activity_Description , Activity_Gender_Preference , Budget_Level, Fitness_Level, Intensity_Level, Activity_Image_Url, Resources, Participants})
            let userFound = await user.findById(createdActivity.Creator._id)
            userFound.Activities.push(createdActivity._id)
            userFound.save()
            res.send(createdActivity)
        }
    } catch (errorMsg) {
        sendError(res , errorMsg);
    }
})

activityRouter.post("/addUser", async(req, res) => {
    try {
        let errors = [];
        const {activityId, userId} = req.query;
        if(!activityId) errors.push("No Activity was provided") && sendError(res, errors)
        else {
            const activityFound = await activity.findById(activityId);
            const userFound = await user.findById(userId);
            if(!userFound && !userFound.Participants) errors.push("No user was found with these credentials") && sendError(res,errors)
            if(!activityFound && !activityFound.Participants ) errors.push("No Activity was found with these credentials") && sendError(res, errors)
            else {
                debugger
                // activityFound.Capacity.push(req.user._id);
                userFound.Activities.push(activityId);
                activityFound.Participants.push(userId);
                await userFound.save()
                await activityFound.save();
                sendSuccess(res, "You have successfully signed up for this activity");
            }
        } 
        
    } catch (errorMsg) {
        sendError(res , errorMsg);
    }
})


// General Helper Method to send Error message back to Client when Error occurs
const sendError = (res , errorMsg) => {
    res.send({
        message: "An error has occurred",
        cause: errorMsg,
        status: errorMsg.status
    });
}

// General Helper Method to send Success message back to Client when Error occurs and redirect
const sendSuccess = (res, successMsg, createdUser, redirectUrl) => {
    res.send({
        success_msg: successMsg,
        user: createdUser,
        redirectUrl: redirectUrl != null || redirectUrl != undefined ? redirectUrl : ""
    })
}


export { activityRouter }
