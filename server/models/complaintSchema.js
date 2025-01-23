const mongoose = require('mongoose');

const complaints = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  hostelName: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  img: {
    type: String,
  },
  upVotedBy: [
    {
      type: String,
      
    }
  ],
  downVotedBy: [
    {
      type: String,
    }
  ],
  isResolved: {
    type: Boolean,
    required: true,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, { timestamps: true }, { strictPopulate: false });


module.exports = mongoose.model("Complaint", complaints);