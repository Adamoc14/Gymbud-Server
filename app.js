// Variable Declarations and Imports
import { express } from './Helpers_and_Imports/libs_required.js'
import { userRouter } from './api/users.js'
const app = express(),
port = process.env.PORT || 7000


// Middlewares
app.use(express.json())

// Routes
app.get("/", (req,res) => {
    res.send({
        message: "Well you're up and running, congrats"
    });
})

app.use("/api/v1/users", userRouter)

// App Listener 
app.listen(port , () => {
    console.log(`Your application is running on port ${port}, fair play chief`)
})