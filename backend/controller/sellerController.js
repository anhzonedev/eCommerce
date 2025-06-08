import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";
import cloudinary from "../config/cloudinary.js";

dotenv.config();