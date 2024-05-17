import { UserModel } from "../../data";
import { CustomError, RegisterUserDto } from "../../domain";


export class AuthService {

    // DI
    constructor() {}

    public async registerUser( registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest('Email already exists');
        return 'Ok';
    }
}