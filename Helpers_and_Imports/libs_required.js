// Imports and variable Declarations
import express from 'express'
import mongoose from 'mongoose'
import Joi from 'joi'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import passportLocal from 'passport-local'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import cloudinary from 'cloudinary'
import expressSession from 'express-session'
import dotenv from 'dotenv'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import crypto from 'crypto'
import Pusher from 'pusher'
import awsSdkS3 from 'aws-sdk/clients/s3.js'
import multerS3 from 'multer-s3'

// Checking if local or production mode for use of dotenv
if(process.env.NODE_ENV !== 'production') dotenv.config();

// Exporting everything
export { express , mongoose  , Joi, bcrypt , passport , multerS3, awsSdkS3, expressSession , passportLocal , cookieParser , cors , cloudinary, crypto, CloudinaryStorage, multer , Pusher}