const roleModel = require("../model/role.model");
class roleController {
    async getlistRole (req , res){
        const roles = await roleModel.find();
        return res.json(roles);
    }
    async addRole (req ,res){
        const roleData = req.body;
        console.log(roleData);
        const newRole = new roleModel(roleData);
        newRole.save();
        return res.json(newRole)
    }
}
module.exports = new roleController();