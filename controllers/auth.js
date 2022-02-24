import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        //* get data and validations
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(422).json({ status: 422, message: "invalid inputs!" });
            return;
        }

        //* checking for similar email
        const isExistUser = await User.findOne({ email });
        if (isExistUser) {
            res.status(422).json({ status: 422, message: "email is taken!" });
            return;
        }

        //* hashing password
        const hashedPassword = await hashPassword(password);

        //* add a new user
        const user = await new User({ name, email, password: hashedPassword }).save();

        res.status(201).json({ status: 201, message: "ok!" });
        return;
    } catch (e) {
        res.status(500).json({ status: 500, message: "server error!", errorMessage: e });
        return;
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //* check for user exist
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ status: 404, message: "user not found!" });
        }

        //* check password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(422).json({ status: 422, message: "password mismatch!" });
        }

        //* make token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        //* set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true //* only in https
        });

        //* clear password for response
        user.password = undefined;

        return res.status(200).json({ status: 200, message: "success full login!", data: user });
    } catch (e) {
        console.log(e);
        return;
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "logout successfull!" });
    } catch (e) {
        console.log(e);
        return;
    }
};

export const currentUser = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password").exec();
        console.log("CURRENT_USER", user);
        return res.status(200).json({status: 200, data: user});
    }
    catch(e){
        console.log(e);
        return;
    }
}