const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    // unique: true,
  },
  pictureUrl: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    require: true,
  },
  category: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  isDeleted: { type: Boolean, default: false, select: false },
});

schema.plugin(require("./plugins/isDeletedFalse"));

const Menu = mongoose.model("Menu", schema);
module.exports = Menu;
