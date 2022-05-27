const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      trim: true,
      required: true,
    },
    FCategory:{
        type: String,
        trim: true,
        required: true,
      },
    Description: {
      type: String,
      trim: true,
      required: true,
    },
    Body: {
      type: String,
      trim: true,
      required: true,
    },
    Created_at: {
        type:Date,
        default: Date.now()
      },

  },
  { timestamps: true }
);

module.exports=mongoose.model("Forum",forumSchema);