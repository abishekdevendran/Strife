import { Request, Response } from "express";

const userDataController = (req: Request, res: Response) => {
  if(!req.session.user){
    res.status(401).send({message: "User not logged in"});
  }else{
    res.status(200).send({user:req.session.user});
  }
};

export default userDataController;