
import conversationModel, { chatType } from '../../../../DB/models/conversation.model.js';
import userModel from '../../../../DB/models/user.model.js';
import { asyncHandler } from './../../../middleware/asyncHandler.js';
import groupModel from './../../../../DB/models/group.model.js';
import bcrypt from 'bcryptjs';
import messageModel from '../../../../DB/models/message.model.js';

export const createGroup = asyncHandler(
    async (req, res, next) => {
        // select  members, name, groupImage
        //groupImageURL and password not required
        let { members, name, groupImageURL, password } = req.body;
        if (!groupImageURL || groupImageURL === '') {
            groupImageURL = "https://png.pngtree.com/png-vector/20190226/ourmid/pngtree-vector-leader-of-group-icon-png-image_705771.jpg"
        }
        //check name not repeated
        const checkGroup = await groupModel.findOne({ name });
        if (checkGroup) {
            return next(Error('duplicate group name', { cause: 400 }))
        }

        //check members
        const existingUsers = await userModel.find({ _id: { $in: members } });
        if (existingUsers.length !== members.length) {
            return next(Error('invalid users ids', { cause: 404 }))
        }

        //push logged in user
        const ownerId = JSON.parse(JSON.stringify(req.user._id))
        members.push(ownerId)

        //create conversation and save users
        const conversation = await conversationModel.create({ users: members, type: chatType.Group, createdBy: req.user._id })

        if (conversation) {
            //create group
            if (password) {
                password = bcrypt.hashSync(password, +process.env.SALTROUND);
            }

            const group = await groupModel.create({ name, groupImageURL, members, conversation: conversation._id, password, createdBy: req.user._id });
            return group ? res.status(200).json({ message: "done" , conversationId: conversation._id}) : next(Error('failed to create group', { cause: 400 }))
        } else {
            next(Error('failed to create conversation', { cause: 400 }));
        }

    }
)

export const getUserGroups = asyncHandler(
    async (req, res, next) => {
        const groups = await groupModel.find({ members: {$in:[req.user._id]} }).select('name groupImageURL lastMessage members conversation').populate([
            {
                path: 'members',
                select: 'firstName lastName profilePic'
            },
            {
                path: 'lastMessage',
                select: 'sender content',
                populate: {
                    path: 'sender',
                    select: 'firstName lastName profilePic'
                }
            }
        ]
        ).sort({ updatedAt: -1 });
        return groups? res.status(200).json({message: "done", groups}) : next(Error('something went wrong', {cause: 400}))
    }
)

export const getAllGroups = asyncHandler(
    async(req, res, next) => {
        const groups = await groupModel.find({ members: { $nin: [req.user._id] } }).select('name groupImageURL password');
        const userGroups = await groupModel.find({ members: {$in:[req.user._id]} }).select('name groupImageURL lastMessage members conversation').populate([
            {
                path: 'members',
                select: 'firstName lastName'
            },
            {
                path: 'lastMessage',
                select: 'sender content',
                populate: {
                    path: 'sender',
                    select: 'firstName lastName profilePic'
                }
            }
        ]
        ).sort({ updatedAt: -1 });
        return groups? res.status(200).json({message: "done", groups, userGroups}) : next(Error('something went wrong', {cause: 400}))
    }
)

export const joinGroup = asyncHandler(
    async(req, res, next) => {
        const { groupId, password } = req.body;
        console.log({ groupId, password })
        const group = await groupModel.findById(groupId).select('conversation password')
        if(group.password !== '' && group.password){
            if(!password){
                return next(Error('invalid group password', { cause:409 }))
            }
            const match = bcrypt.compareSync(password, group.password)
            if (match) {
                await conversationModel.findByIdAndUpdate({_id: group.conversation},{$addToSet:{users: req.user._id}})
                const newGroup = await groupModel.findByIdAndUpdate({_id: groupId},{$addToSet:{members: req.user._id}}, {new:true}).select('members')
                return res.status(200).json({message: "done", group: newGroup});
            } else {
                return next(Error('invalid group password', { cause:409 }))
            }
        }else{
            await conversationModel.findByIdAndUpdate({_id: group.conversation},{$addToSet:{users: req.user._id}})
            const newGroup = await groupModel.findByIdAndUpdate({_id: groupId},{$addToSet:{members: req.user._id}}, {new:true}).select('members')
            return res.status(200).json({message: "done", group: newGroup});
        }
    }
)

export const getGroupMessages = asyncHandler(
    async(req, res, next) => {
        const { groupId } = req.params;
        
        let group = await groupModel.findOne({ _id: groupId, members:{$in:[req.user._id]}, type: chatType.Group }).select('name groupImageURL members conversation').populate({
            path: 'members',
            select: 'firstName lastName profilePic',
            match:{_id : {$ne: req.user._id}}
        });
        if (group) {
            // get all messages
            const messages = await messageModel.find({ conversation: group.conversation }).populate(
                {
                    path: 'sender',
                    select: 'firstName lastName profilePic'
                }
            ).select('sender content').sort({updatedAt: 1});

            group = JSON.parse(JSON.stringify(group))
            group.messages = messages
            return res.status(200).json({ message: "done", group })

        } else {
            next(Error('group not found', { cause: 404 }))
        }
    }
)