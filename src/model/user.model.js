const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, require: true},
  email: { type: String, require: false},
  phone: { type: String, require: false},
  address: { type: String, require: false},
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true},
  role : {type : String ,require: true ,default :"User"},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_by :{ type: String, require: true },
  created_at :{ type: Date, default : Date.now },
  update_by :{ type: String , require : false },
  update_at : { type: Date, default : Date.now },
  status : { type : Number , require: false , default : 1}
});

const user = mongoose.model('User' , userSchema) ;
module.exports = user;
