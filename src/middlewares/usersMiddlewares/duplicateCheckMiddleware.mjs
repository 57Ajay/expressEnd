 /** A middleware which checks if the user already exists */
import { mockUserData } from "../../utils/constants.mjs";

export const duplicateCheckMiddleware = (req, res, next)=>{
    const {body: newUser} = req;
    const duplicate = mockUserData.find((user)=> user.userName === newUser.userName);
    if(duplicate){
      res.status(409).json({msg: "User already exists",
      context: "userName and displayName should be unique",
      });
      console.log("duplicate");
      return;
    }
    next();
};