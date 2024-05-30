const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema({
    name : { type : String , require : true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})
const role = mongoose.model('roles',roleSchema);
module.exports = role;