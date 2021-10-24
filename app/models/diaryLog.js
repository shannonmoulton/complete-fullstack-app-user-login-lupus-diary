var mongoose = require("mongoose");
var diaryLogSchema = mongoose.Schema({
  ownerId: String,
  currentDate: String,
  medication: String,
  medicationTime: String,
  description: String,
  mood: String,
  symptoms: [String],
  photo: String,
});
module.exports = mongoose.model("Diary-Log", diaryLogSchema);
