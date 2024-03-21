import express from "express";
import {databaseErrorHandler, queries} from "../database";
import {Empty} from "../types";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const SECRET_KEY = process.env["SECRET_KEY"] || "default_secret_key"
const router = express.Router();

router.post("/users/register", databaseErrorHandler<Empty, Empty, {name: string, email: string, password: string}>(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const users = await queries.getUser(email);

    if (users.length != 0){ //check if any other user has that email
        return res.status(400).send("Email is already associated with an account");
    }
    try{
        const hash = await bcrypt.hash(password, 10);
        const result = await queries.addUser(name,email,hash);
        return res.status(200).send("Account succussfully added")
        // const token = jwt.sign({email: email}, SECRET_KEY);
        // return res.status(200).json({token: token})

    }
    catch(err: any){
        console.log(`error: ${err}`)
        return res.status(err).json({error: "Server error",});
    }
}));
router.post("/users/login", databaseErrorHandler<Empty, Empty, {email:string, password:string }>(async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    //check if user exists
    const users = await queries.getUser(email);
    if( users.length == 0){
        res.status(400).json({error: "User not registered"});
    }
    try{
        const match = await bcrypt.compare(password, users[0].password);
        if( match === true){
            //check password
            const token = jwt.sign({email:users[0].email}, SECRET_KEY, {expiresIn:"1h"});
            return res.status(200).json({
                message: "User signed in",
                token: token 
            });
        }
        else {
            return res.status(400).json({
               error: "Incorrect Password" 
            });
        }
    }
    catch(err:any){
        return res.status(err).json({error:"Server Error"})
    }
    
}));
//protected endpoint
//TODO move token verification to its own middleware function
router.get("/users/profile", databaseErrorHandler<Empty, Empty,Empty>(async (req, res) =>{
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decodedToken  = jwt.verify(token, SECRET_KEY) as {email: string}
            const email = decodedToken.email;
            const users = await queries.getUser(email);
            const thisUser = { email:users[0].email, name:users[0].name, user_id:users[0].user_id}
            return res.status(200).json(thisUser)
        }
        catch(err: any){
            return res.status(401).json({message: "Invalid token"})
        }
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}))

export default router;
