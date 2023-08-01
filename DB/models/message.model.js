import { Schema, model, Types, mongoose } from 'mongoose'

const messageSchema = new Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: [true, 'message should belong to a conversation'] },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'sender is required'] },
    recipient: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    content: { type: String, required: [true, 'body of message is required'] },
}, {
    timestamps: true
})


const messageModel = model('Message', messageSchema)

export default messageModel

