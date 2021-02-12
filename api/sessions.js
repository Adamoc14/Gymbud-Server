// Variable Declarations and Imports
import { express } from "../Helpers_and_Imports/libs_required.js"
import { session , sessionValidationSchema } from '../DB/Models/session.js'
import { user } from '../DB/Models/user.js'
const sessionRouter = express.Router()

// Joi schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

// Declaring array to carry my errors 
const errors = [];


//Router is mounted at /api/v1/sessions , all routes after this will be prefixed with this

// Setting up the sessionRouter's routes


//_____Getting_All_Sessions________
sessionRouter.get("/", async(req,res) => {
    const sessions = await session.find()
    res.send(sessions)
})

//____Creating_A_Session___________
sessionRouter.post("/" , async(req,res) => {
    try {
        const { error } = await sessionValidationSchema.validate(req.body, options);
        if( error) errors.push(error) && sendError(res , errors);
        else {
            const { Creator , Time , Date , Location , Duration , Activity_Type , Activity_Name , Activity_Description , Activity_Gender_Preference , Video_Or_In_Person , Intensity_Level, Activity_Image_Url, Resources, Capacity } = req.body;
            let createdSession = await session.create({Creator , Time , Date , Location , Duration , Activity_Type , Activity_Name , Activity_Description , Activity_Gender_Preference , Video_Or_In_Person , Intensity_Level, Activity_Image_Url, Resources, Capacity})
            let userFound = await user.findById(createdSession.Creator)
            userFound.Sessions.push(createdSession._id)
            userFound.save()
            res.send(createdSession)
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

export { sessionRouter }
