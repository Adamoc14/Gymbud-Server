// All Code in this file is from 
//WebDevSimplified Video here  - https://www.youtube.com/watch?v=-RCnNyD0L-s&ab_channel=WebDevSimplified
// & 
// Nathaniel Woodbury Video here - https://www.youtube.com/watch?v=IUw_TgRhTBE&ab_channel=NathanielWoodbury
// Nathaniel's just describes our use case of using two servers better 

//This is how to set up user authentication system for Login and register Functionality using passportjs on a node server

// _____Declaring_Our_Variables_______

import { user } from '../DB/Models/user.js'
import { bcrypt , passportLocal} from "./libs_required.js"
const localStrategy = passportLocal.Strategy;


//Pasport Function To Export 
const instantiate = async passport => {
    passport.use(
        new localStrategy( async(username , password, done) => {
            try {
                const userFound = await user.findOne({ Username: username });
                if(!userFound) return done(null , false , {message: "No user found with that username"})
                try {
                    const userMatch = await bcrypt.compare(password , userFound.Password)
                    if (userMatch) 
                        return done(null , userFound)
                    else 
                        return done(null , false , {message: "Wrong Password"})
                } catch (error) {
                    return  error;
                }
            } catch (error) {
                return  error;
            }
        })
    )
    passport.serializeUser((userNormal , done) => {
        try {
            return done(null , userNormal.id)
        } catch (error) {
            throw error;
        }
    });
    passport.deserializeUser(async(userId , done) => {
       try {
           const userFound = await user.findOne({ _id: userId });
           return done(null , userFound)
       } catch (error) {
        throw error; 
       }
    });
};

export default instantiate
