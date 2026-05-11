const mongoose = require('mongoose');

const RoomNoSchema = new mongoose.Schema({
  dept: { type: mongoose.Schema.Types.ObjectId, required: true },
  programme:{ type: mongoose.Schema.Types.ObjectId, required: true },
  block: { type: mongoose.Schema.Types.ObjectId, required: true  }, 
  roomNo: { type: String, required: true } 

}, { timestamps: true });

module.exports = mongoose.model('RoomNo', RoomNoSchema);
