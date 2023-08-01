import { asyncHandler } from './../../../middleware/asyncHandler.js';
import conversationModel, { chatType } from './../../../../DB/models/conversation.model.js';
import messageModel from './../../../../DB/models/message.model.js';
import userModel from '../../../../DB/models/user.model.js';
import groupModel from '../../../../DB/models/group.model.js';

//add chat
export const addConversation = asyncHandler(
    async (req, res, next) => {
        const { type, users } = req.body;
        // Chat
        const existingUsers = await userModel.find({ _id: { $in: users } });
        if (existingUsers.length !== users.length) {
            return next(Error('invalid users ids', { cause: 404 }))
        }
        const ownerId = JSON.parse(JSON.stringify(req.user._id))
        users.push(ownerId)
        if (type === chatType.Chat) {
            req.users = users
            const oldConversation = await conversationModel.findOne({ users: { $all: users }, type: chatType.Chat })
            if (!oldConversation && users.length === 2) {
                req.createdBy = req.user._id
                const conversation = await conversationModel.create(req.body);
                return conversation ? res.status(201).json({ message: "done" }) : next(Error('failed to create the conversation', { cause: 404 }))
            } else {
                return res.status(200).json({ message: "done" })
            }
        }
    }
)

// get specific chat
export const getSpecificChat = asyncHandler(
    async (req, res, next) => {
        const { conversationId } = req.params;
        // const ownerId = JSON.parse(JSON.stringify(req.user._id))
        // let recipients;
        // recipients = [ownerId, friendId]

        let conversation;
        // if (friendId) {
        //     //seen message
        //     conversation = await conversationModel.findOneAndUpdate({ users: { $all: [ownerId, friendId] }, type: chatType.Chat }, { $addToSet: { lastSeen: req.user._id } }, { new: true }).select('users lastSeen').populate({
        //         path: 'users',
        //         select: 'firstName lastName profilePic isOnline',
        //         match: { _id: { $ne: req.user._id } }
        //     });
        // } else {
            conversation = await conversationModel.findOneAndUpdate({ _id: conversationId , type: chatType.Chat }, { $addToSet: { lastSeen: req.user._id } }, { new: true }).select('users lastSeen').populate({
                path: 'users',
                select: 'firstName lastName profilePic isOnline',
                match: { _id: { $ne: req.user._id } }
            });
        // }

        if (conversation) {
            // get all messages
            const messages = await messageModel.find({ conversation: conversation._id }).populate(
                {
                    path: 'sender',
                    select: 'firstName lastName profilePic isOnline'
                }
            ).select('sender content createdAt').sort({ updatedAt: 1 });
            conversation = JSON.parse(JSON.stringify(conversation))
            conversation.messages = messages

            return res.status(200).json({ message: "done", conversation })

        } else {
            next(Error('conversation not found', { cause: 404 }))
        }
    }
)

// get user chats
export const getUserChats = asyncHandler(
    async (req, res, next) => {
        const ownerId = JSON.parse(JSON.stringify(req.user._id))
        const chats = await conversationModel.find({ users: { $in: [req.user._id] }, type: chatType.Chat }).populate([
            {
                path: 'lastMessage',
                select: 'sender content createdAt',
                populate: {
                    path: 'sender',
                    select: 'firstName lastName profilePic'
                },

            },
            {
                path: 'users',
                select: 'firstName lastName profilePic',
                match: { _id: { $ne: req.user._id } }
            }
        ]).select('users lastMessage lastSeen').sort({ updatedAt: -1 });
        return chats ? res.status(200).json({ message: "done", chats }) : next(Error('something went wrong', { cause: 400 }))
    }
)

export const getRecentChats = asyncHandler(
    async (req, res, next) => {
        let chats = await conversationModel.find({ users: { $in: [req.user._id] } }).select('users type').limit(5).populate(
            {
                path: 'users',
                select: 'profilePic firstName lastName isOnline',
                match: { _id: { $ne: req.user._id } }
            }
        ).sort({ updatedAt: -1 })
        chats = JSON.parse(JSON.stringify(chats))
        console.log(chats)
        for (let i = 0; i < chats.length; i++) {
            if (chats[i].type === chatType.Group) {
                const group = await groupModel.findOne({ conversation: chats[i]._id }).select('name groupImageURL')
                chats[i].details = group;
            }
        }
        return chats ? res.status(200).json({ message: "done", chats }) : next(Error('invalid user id', { cause: 404 }))
    }
)

