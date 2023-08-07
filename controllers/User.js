const { User } = require("../models/User");

exports.fetchUserById = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  };
// exports.createUser = async (req, res)=>{
//     const user = new User(req.body);
//     try{
//         const response = await user.save();
//         res.status(201).json(response);
//     }catch(err){
//         res.status(400).json(err);
//     }
// }

exports.updateUser = async (req, res)=>{
    const {id} = req.params;
    try{
        const user = await User.findByIdAndUpdate(id, req.body, {new:true})
        res.status(200).json(user);
    }catch(err){
        res.status(400).json(err);
    }
}