// Variable Declarations and Imports
import { express, bcrypt } from "../Helpers_and_Imports/libs_required.js"
import { user, userValidationSchema } from '../DB/Models/user.js'
import passport from "passport";
const userRouter = express.Router()

// Joi schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

// Router is mounted at /api/v1/users , all routes after this will be prefixed with this


// Setting up userRouter's Routes

// ____Getting_All_Users_____
userRouter.get("/", async (req, res) => {
    const users = await user.find()
    res.send(users)
})

// ____Creating_A_New_User_____
userRouter.post("/", async (req, res) => {
    // Declaring array to carry my errors 
    let errors = [];
    try {
        const { error } = userValidationSchema.validate(req.body, options);
        const { Username } = req.body;
        let { Password } = req.body;
        const userFound = await user.findOne({ Username: Username });
        if (userFound) {
            errors.push("Username is already registered")
            sendError(res, errors);
            return
        }
        if (error) errors.push(error) && sendError(res, errors);
        else {
            const { Profile_Url, Name, Gender, DOB, Preferred_Intensity, Fitness_Level, Preferred_Age_Range, Preferred_Distance_Range, Video_Or_In_Person, Resources, Activities_Enjoyed } = req.body
            try {
                // BcryptJS - https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified
                const hashedPass = await bcrypt.hash(Password, 10);
                Password = hashedPass;
                let createdUser = await user.create({ Username, Password, Profile_Url, Name, Gender, DOB, Preferred_Intensity, Fitness_Level, Preferred_Age_Range, Preferred_Distance_Range, Video_Or_In_Person, Resources, Activities_Enjoyed })
                sendSuccess(res, "You are now registered and can log in", createdUser, "login");
            } catch (errorMsg) {
                sendError(res, errorMsg, "Session_Details");
            }
        }
    } catch (errorMsg) {
        sendError(res, errorMsg);
    }
})

userRouter.post("/login", async (req, res, next) => {
    try {
        // Declaring array to carry my errors 
        let errors = [];
        passport.authenticate("local", (err, userNormal, info) => {
            if (err) errors.push(err) && sendError(res, errors);
            if (info != undefined && info.message) errors.push(info.message) && sendError(res, errors);
            if (!userNormal) {
                errors.push("No User exists with these credentials");
                sendError(res, errors);
                return
            }
            req.logIn(userNormal, err => {
                if (err) return sendError(res, err);
                req.session.save(() => {
                    req.session.user = req.user;
                    sendSuccess(res, "You are now successfully logged in", req.user, "Home");
                });
            });
        })(req, res, next)
    } catch (errorMsg) {
        sendError(res, errorMsg);
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
        { userName, password, Name, Profile_Url, Gender, DOB, Preferred_Intensity, Fitness_Level, Resources, Preferred_Age_Range, Video_Or_In_Person } = req.body,
        newUser = { userName, password, Name, Profile_Url, Gender, DOB, Preferred_Intensity, Fitness_Level, Resources, Preferred_Age_Range, Video_Or_In_Person }
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

// General Helper Method to send Error message back to Client when Error occurs and redirect
const sendError = (res, errorMsg, redirectUrl) => {
    res.send({
        message: "An error has occurred",
        cause: errorMsg,
        status: errorMsg.status,
        redirectUrl: redirectUrl != null || redirectUrl != undefined ? redirectUrl : ""
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


export { userRouter }

