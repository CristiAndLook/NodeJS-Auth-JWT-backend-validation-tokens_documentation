import { Request, Response } from 'express';

export class AuthController {

    //DI
    constructor() {
    }

    loginUser = (req: Request, res: Response) => {
        res.json('user login');
    }

    registerUser = (req: Request, res: Response) => {
        res.json('user register');
    }

    validateEmail = (req: Request, res: Response) => {
        res.json('validate email');
    }
}