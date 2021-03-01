// Imports and variable Declarations
import express from 'express'
import mongoose from 'mongoose'
import Joi from 'joi'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import passportLocal from 'passport-local'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import crypto from 'crypto'

// Checking if local or production mode for use of dotenv
if(process.env.NODE_ENV !== 'production') dotenv.config();

// Exporting everything
export { express , mongoose  , Joi, bcrypt , passport , passportLocal , session , cookieParser , cors , cloudinary, crypto, CloudinaryStorage, multer}