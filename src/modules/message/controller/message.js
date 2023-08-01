
import conversationModel, { chatType } from '../../../../DB/models/conversation.model.js';
import groupModel from '../../../../DB/models/group.model.js';
import messageModel from '../../../../DB/models/message.model.js';
import userModel from '../../../../DB/models/user.model.js';
import { io } from '../../../../index.js';
import { asyncHandler } from './../../../middleware/asyncHandler.js';

export const sendMessage = asyncHandler(
    async(req, res, next) => {
        // io.emit("reply", "hello client");
        // recipient not required
        const { conversationId  } =  req.params;
        const { content, recipient, type } = req.body
        if(recipient){
            const checkUser = await userModel.findById({recipient});
            if(!checkUser){
                return next(Error('invalid recipient id', {cause: 404}));
            }
        }

        // To check user exist  in this conversation
        const conversation = await conversationModel.findOne({_id: conversationId, users: { $in: [req.user._id] }}).select('users type')
        if(!conversation){
            return next(Error('conversation not found', {cause:404}))
        }

        // Create message
        const message = await messageModel.create({content, recipient:conversation.users, conversation: conversationId, sender: req.user._id});
        if (message) { 
            //save message as last in its conversation
            await conversationModel.updateOne({_id: conversationId}, {lastMessage: message._id, $unset:{lastSeen: 1}})
            if(type === chatType.Group){
                await groupModel.updateOne({conversation: conversationId}, {lastMessage: message._id})
            }
                res.status(201).json({message: "done"})

        } else {
            next(Error('failed to send message', {cause: 400}))
        }
    }
)

// get messages of specific conversation
export const getMessages = asyncHandler(
    async(req, res, next) => {
        const { conversationId } = req.params
        const messages = await messageModel.find({conversation: conversationId, users: req.user._id}).select('sender content').populate({
            path: 'sender',
            select: 'profilePic firstName lastName'
        }).sort({updatedAt: 1})
        return messages? res.status(200).json({message: "done", messages}) : next(Error('conversation not found'));
    }
)

