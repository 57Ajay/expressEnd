/** A Middleware which gets user index whose id is 
   * same as the id in the url this middleware will pass that index
   * to the next middleware or the url with which it was called
*/
import { mockUserData } from "../../utils/constants.mjs";
export const resolveIndexByUserId = (req, res, next)=>{
    const {params: {id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUserData.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return res.status(404).send("User not found");
    req.findUserIndex = findUserIndex;
    next();
  };
  