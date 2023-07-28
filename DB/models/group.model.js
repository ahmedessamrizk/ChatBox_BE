import { Schema, model, Types, mongoose } from 'mongoose'


const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  groupImageURL: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  password: String,
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  temp: Boolean
}, {
  timestamps: true
});


const groupModel = model('Group', groupSchema)

export default groupModel

