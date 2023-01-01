import { Request, Response } from "express";

const userDataController = (req: Request, res: Response) => {
  if(!req.session.user){
    res.status(401).send({message: "User not logged in"});
  }else{
    let censoredUser:any = {...req.session.user};
    delete censoredUser.password;
    res.status(200).send({user:censoredUser});
  }
};

export default userDataController;