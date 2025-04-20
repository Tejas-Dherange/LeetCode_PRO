import db from "../libs/db.js";
import bcrypt from "bcryptjs"

const register =  async(req, res) => { 
    const { name, email, password ,image} = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    const existingUser=await db.user.findUnique({
      where: {
        email,
      },
    })
  
    if(existingUser){
      return res.status(400).json({ message: "User already exists" });
    }
  
    const user=await db.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        image
      },
    })

    if(!user){
      return res.status(400).json({ message: "User not created" });
    }
    
    
    return res.status(200).json({ message: "User created successfully" });
  }

const login = (req, res) => {
  res.send("login");
};

export { register, login };
