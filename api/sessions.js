// Variable Declarations and Imports
import { express } from "../Helpers_and_Imports/libs_required.js"
import { session , sessionValidationSchema } from '../DB/Models/session.js'
const sessionRouter = express.Router()

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
        const validatedResult = await sessionValidationSchema.validate(req.body)
        if(validatedResult) {
            const { Creator , Time , Date , Location , Activity_Type , Activity_Name , Activity_Description , Activity_Gender_Preference , Video_Or_In_Person , Intensity_Level, Activity_Image_Url, Resources, Capacity } = req.body;
            let createdSession = await session.create({Creator , Time , Date , Location , Activity_Type , Activity_Name , Activity_Description , Activity_Gender_Preference , Video_Or_In_Person , Intensity_Level, Activity_Image_Url, Resources, Capacity})
            res.send(createdSession)
        }
    } catch (error) {
        res.send({
            message: "An error has occurred",
            cause: error,
            status: error.status
        });
    }
})

export { sessionRouter }
