import { asyncHandler } from "../../../middleware/asyncHandler.js";
import { findByIdAndUpdate, findById, updateOne, find, findOne, findOneAndUpdate } from './../../../../DB/DBmethods.js';
import CryptoJS from "crypto-js";
import cloudinary from './../../../services/cloudinary.js';
import userModel from "../../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs'
import { checkUser } from "../../../services/checkUser.js";
import { calcDate } from '../../../services/calcDate.js';
import { paginate } from "../../../services/pagination.js";

export const privateData = '-confirmEmail -isBlocked -password -code -accountType';
const secureURL = "https://res.cloudinary.com/ddpckjxeg/image/upload/v1690312129/User/favpng_user-profile-avatar_vkodns.png";

//update: firstName lastName DOB phone gender photos
export const updateProfile = asyncHandler(
    async (req, res, next) => {
        let { phone, DOB } = req.body;
        if (phone) {
            req.body.phone = CryptoJS.AES.encrypt(phone, process.env.CRYPTPHONESECRET).toString();
        }
        if (DOB) {
            DOB = new Date(DOB);
            req.body.age = calcDate(DOB);
        }
        //const exist = await findOne({ model: userModel, filter: { userName }, select: 'userName' });
        //if (exist) {
        //  return next(Error('duplicated userName', { cause: 409 }));
        //}
        const updatedUser = await findByIdAndUpdate({ model: userModel, filter: { _id: req.user._id }, data: req.body, options: { new: true }, select: privateData });
        const bytes = CryptoJS.AES.decrypt(updatedUser.phone, process.env.CRYPTPHONESECRET);
        updatedUser.phone = bytes.toString(CryptoJS.enc.Utf8);
        return res.status(200).json({ message: "done", updatedUser })
    }
)

export const addProfilePic = asyncHandler(
    async (req, res, next) => {
        if (!req.file) {
            return next(Error('please upload the image', { cause: 400 }));
        }
        //Delete old image but not default image
        const { profilePic } = await findById({ model: userModel, filter: { _id: req.user._id }, select: 'profilePic' });
        if (profilePic.secure_url !== secureURL) {
            cloudinary.uploader.destroy(profilePic.public_id);
        }

        //upload new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `User/${req.user._id}` });
        req.body.profilePic = { secure_url, public_id };
        const updatedUser = await findByIdAndUpdate({ model: userModel, filter: { _id: req.user._id }, data: req.body, options: { new: true }, select: "profilePic" });
        return res.status(200).json({ message: "done", updatedUser })
    }
)

export const updatePassword = asyncHandler(
    async (req, res, next) => {
        //cPassword
        const { oldPassword, newPassword } = req.body;
        const user = await findById({ model: userModel, filter: { _id: req.user._id } });
        const match = bcrypt.compareSync(oldPassword, user.password);
        if (match) {
            const hash = bcrypt.hashSync(newPassword, +process.env.SALTROUND);
            const update = await updateOne({ model: userModel, filter: { _id: req.user._id }, data: { password: hash } });
            return update.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(200).json({ message: "failed to update password" })
        } else {
            return next(Error('Invalid password', { cause: 401 }));
        }
    }
)

export const getProfile = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        let user;
        //anotherUser
        if (id) {
            user = await findOne({
                model: userModel, filter: { _id: id }, select: privateData,

            })
        } else {    //ownProfile
            user = await findById({
                model: userModel, filter: { _id: req.user._id }, select: privateData,

            })
        }
        if (user.phone) {
            const bytes = CryptoJS.AES.decrypt(user.phone, process.env.CRYPTPHONESECRET);
            user.phone = bytes.toString(CryptoJS.enc.Utf8);
        }

        return user ? res.status(200).json({ message: "done", user }) : res.status(404).json({ message: "user is not found" });
    }
)

export const signOut = asyncHandler(
    async (req, res, next) => {
        let date = new Date()
        const result = await findOneAndUpdate({ model: userModel, filter: { _id: req.user._id }, data: { lastSeen: date, isOnline: false }, options: { new: true } });
        return res.status(200).json({ message: "done" });
    }
)
//filter by userName 
export const getUsers = asyncHandler(
    async (req, res, next) => {
        let { userNameQ } = req.query;
        let users;
        if (userNameQ) {
            userNameQ = userNameQ?.toLowerCase();
            users = await userModel.find({ userName: { $regex: `^${userNameQ}` } }).select(privateData)
        } else {
            users = await userModel.find({}).select("-password -code")

        }
        users.forEach(user => {
            if (user.phone) {
                user.phone = CryptoJS.AES.decrypt(user.phone, process.env.CRYPTPHONESECRET).toString(CryptoJS.enc.Utf8);
            }
        });
        return res.status(200).json({ message: "done", users });
    }
)

