import { Schema, model, Types, mongoose } from 'mongoose'

export const chatType = {
    Chat: 'chat',
    Group: 'group'
}

const conversationSchema = new Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    type: { type: String, enum: [chatType.Chat, chatType.Group], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastSeen: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
})


const conversationModel = model('Conversation', conversationSchema)

export default conversationModel
