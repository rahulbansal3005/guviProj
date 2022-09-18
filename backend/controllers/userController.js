const userModel = require("../models/userModels");
module.exports.getUser = async function getUsers(req, res) {
  // let id = req.params.id;
  let id = req.id;
  console.log(id);
  let user = await userModel.findById(id);
  if (user) {
    return res.json(user);
  } else {
    return res.json({
      message: "user not found",
    });
  }
};
