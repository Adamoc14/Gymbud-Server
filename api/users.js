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

// Router is mounted at /users , all routes after this will be prefixed with this


// Setting up userRouter's Routes

// ____Getting_All_Users_____
userRouter.get("/", async (req, res) => {
    let users = await 
    user.find().select('-Password')
    .populate({
        path: 'Conversations',
        populate: {
            path: 'Sender', 
            populate: {
                path: 'Conversations'
            }
        }
    })
    .populate({
        path: 'Conversations',
        populate: {
            path: 'Sender', 
            populate: {
                path: 'Activities'
            }
        }
    })
    .populate({
        path: 'Conversations',
        populate: {
            path: 'Receiver', 
            populate: {
                path: 'Conversations'
            }
        }
    })
    .populate({
        path: 'Conversations',
        populate: {
            path: 'Receiver', 
            populate: {
                path: 'Activities'
            }
        }
    })
    .populate({
        path: 'Conversations',
        populate: {
            path: 'Messages', 
        }
    })
    .populate({
        path: 'Sender',
        populate: {
            path: 'Activities',
            populate: {
                path: 'Participants',
                populate: {
                    path: 'Conversations'
                }
            }
        }
    })
    .populate({
        path: 'Activities',
        populate: {
            path: 'Participants',
            populate: {
                path: 'Buds'
            }
        }
    })
    .populate({
        path: 'Activities',
        populate: {
            path: 'Participants',
            populate: {
                path: 'Activities'
            }
        }
    })
    .populate({
        path: 'Creator',
        populate: {
            path: 'Participants',
            populate: {
                path: 'Conversations'
            }
        }
    })
    .populate({
        path: 'Creator',
        populate: {
            path: 'Participants',
            populate: {
                path: 'Buds'
            }
        }
    })
    .populate({
        path: 'Creator',
        populate: {
            path: 'Participants',
            populate: {
                path: 'Activities'
            }
        }
    })
    .exec()
    // user.find()
    //     .populate({path: "Conversations" , populate: ['Sender' , {path: 'Sender', populate: {'Conversations'}}, 'Receiver', 'Receiver.Conversations', 'Receiver.Activities', 'Messages', 'Messages.Sender.senderId']})
    //     .populate({path: 'Activities' , populate: ['Creator', 'Participants']})
    //     .populate({path: 'Buds'})
    //     .exec()
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
            const { Profile_Url, Name, Email, Gender, DOB, Preferred_Intensity, Fitness_Level, Preferred_Age_Range, Preferred_Distance_Range, Resources, Outdoor_Activities_Enjoyed } = req.body
            try {
                // BcryptJS - https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified
                const hashedPass = await bcrypt.hash(Password, 10);
                Password = hashedPass;
                let createdUser = await user.create({ Username, Password, Profile_Url, Name, Email, Gender, DOB, Preferred_Intensity, Fitness_Level, Preferred_Age_Range, Preferred_Distance_Range, Resources, Outdoor_Activities_Enjoyed })
                createdUser = createdUser.select('-Password')
                sendSuccess(res, "You are now registered and can log in", createdUser, "login");
            } catch (errorMsg) {
                sendError(res, errorMsg, "Activity_Details");
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
                req.session.save(async() => {
                    req.session.user = req.user;
                    let userLoggingIn = await user.findById(req.user.id).select('-Password')
                    userLoggingIn = await userLoggingIn.populate("Conversations").populate({path: "Conversations", populate:[{ path: 'Sender'} , {path: 'Receiver'} , {path: 'Messages'}]}).populate("Buds").populate("Activities").populate({path: "Activities", populate:[{ path: 'Creator'} , {path: 'Participants'}]}).execPopulate();;
                    // let userLoggingIn =  await req.user.populate("Conversations").populate({path: "Conversations", populate:[{ path: 'Sender'} , {path: 'Receiver'} , {path: 'Messages'}]}).populate("Buds").populate("Activities").populate({path: "Activities", populate:[{ path: 'Creator'} , {path: 'Participants'}]}).execPopulate();
                    sendSuccess(res, "You are now successfully logged in", userLoggingIn, "Home");
                });
            });
        })(req, res, next)
    } catch (errorMsg) {
        sendError(res, errorMsg);
    }
})



// ____Getting_User_By_Id_____
userRouter.get('/:userId', async (req, res) => {
    let errors = [];
    try {
         // Check the id is not null and trim it 
         req.params.userId = req?.params?.userId ?? errors.push("Invalid Id observed, undefined or null values were observed");
         req.params.userId = req?.params?.userId?.trim() ?? errors.push("Couln't parse invalid id with spaces");

         // Error Handling 
        if(errors.length > 0){
            res.status(500).send(errors);
        }

        // Get the valid id
        let searching_user_id =  req?.params?.userId;

         // Find the user 
        let user_found = 
        await user.findById(searching_user_id).select('-Password')
        .populate({path: "Conversations" , populate: ['Sender' , 'Receiver', 'Receiver.Conversations', 'Reciever.Activities', 'Messages', 'Messages.Sender.senderId']})
        .populate({path: 'Activities' , populate: ['Creator', 'Participants']})
        .populate({path: 'Buds'});

        // Return user 
        res.status(200).send(user_found);

    } catch {

    }


})

// // ____Updating_User_By_Id_____
userRouter.put('/:id', async (req, res) => {
    // let { Password } = req.body;
    const { Username, Profile_Url, Name, Email, Gender, DOB, Preferred_Intensity, Fitness_Level, Preferred_Age_Range, Preferred_Distance_Range, Resources, Outdoor_Activities_Enjoyed } = req.body
    try {
        // BcryptJS - https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified
        // const hashedPass = await bcrypt.hash(Password, 10);
        // Password = hashedPass;
        let updatedUser = await user.findByIdAndUpdate(req.params.id, { Username, Profile_Url, Name, Email, Gender, DOB, Preferred_Intensity, Fitness_Level, Preferred_Age_Range, Preferred_Distance_Range, Resources, Outdoor_Activities_Enjoyed }, {new: true}).select('-Password')
        updatedUser = await updatedUser.populate({path: "Conversations" , populate: ['Sender' , 'Receiver', 'Messages']})
        .populate({path: 'Activities' , populate: ['Creator', 'Participants']})
        .populate({path: 'Buds'}).execPopulate();
        sendSuccess(res, "You're details have been updated", updatedUser, "login");
        
    } catch (errorMsg) {
        sendError(res, errorMsg, "UpdateProfilePage");
    }
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

