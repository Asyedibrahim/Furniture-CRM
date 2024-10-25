import db from "../config/config.js";
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {

    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
        return next(errorHandler(400,'All fields are required'));
    };

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';

    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                next(errorHandler(409, 'Email already exists'));
            } else {
                next(err);
            };
        } else {
            res.status(201).json('User created succesfully');
        };
    });
};

export const signIn = (req, res, next) => {

    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        return next(errorHandler(400, 'All fields are required'));
    };

    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email.trim()], (err, result) => {
        if (err) {
            return next(err)
        };
        const validUser = result[0];
        if (!validUser) {
            return next(errorHandler(404, 'User not found!'))
        };

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401,'Invalid Credential'))
        };

        const token = jwt.sign({ id: validUser.id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const { password: pass, ...rest} = validUser;

        res.cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }).status(200).json(rest);

    });
};

export const signOut = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User logged out!')
    } catch (error) {
        next(error);
    }
}