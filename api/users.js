// Variable Declarations and Imports
import { express } from "../Helpers_and_Imports/libs_required.js"
import { user , userValidationSchema} from '../DB/Models/user.js'
const userRouter = express.Router()

// Joi schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

// Declaring array to carry my errors 
const errors = [];

// Router is mounted at /api/v1/users , all routes after this will be prefixed with this


// Setting up userRouter's Routes

// ____Getting_All_Users_____
userRouter.get("/", async (req, res) => {
    const users = await user.find()
    res.send(users)
})

// ____Creating_A_New_User_____
userRouter.post("/", async (req, res) => {
    try {
        const { error } = await userValidationSchema.validate(req.body, options);
        if( error) errors.push(error) && sendError(res , errors);
        else {
            const { userName, password, Profile_Url, Name, Gender, DOB, Preferred_Intensity, Fitness_Level, Resources, Preferred_Age_Range, Video_Or_In_Person } = req.body
            let createdUser = await session.create({userName, password, Profile_Url, Name, Gender, DOB, Preferred_Intensity, Fitness_Level, Resources, Preferred_Age_Range, Video_Or_In_Person})
            res.send(createdUser)
        }
    } catch (error) {
        sendError(res , errorMsg);
    }
})



// ____Getting_User_By_Id_____
userRouter.get('/:id', async (req, res) => {
    const { id } = req.params,
        singleUser = await user.find({ _id: id })
    res.send(singleUser)
})

// // ____Updating_User_By_Id_____
userRouter.put('/:id', async (req, res) => {
    const { id } = req.params,
        { userName, password, Name, Profile_Url, Gender, DOB, Preferred_Intensity, Fitness_Level, Resources, Preferred_Age_Range, Video_Or_In_Person  } = req.body,
        newUser = { userName, password, Name, Profile_Url,Gender, DOB, Preferred_Intensity, Fitness_Level, Resources, Preferred_Age_Range, Video_Or_In_Person  }
    await user.findByIdAndUpdate(id, newUser, { new: true }, (err, updatedUser) => {
        if (err) console.log(err)
        res.send(updatedUser)
    })
})

// ____Deleting_User_By_Id_____
userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    await user.findByIdAndRemove(id)
    res.send({
        message: "Deleted the user"
    })
})

// General Helper Method to send Error message back to Client when Error occurs
const sendError = (res , errorMsg) => {
    res.send({
        message: "An error has occurred",
        cause: errorMsg,
        status: errorMsg.status
    });
}

export { userRouter }

