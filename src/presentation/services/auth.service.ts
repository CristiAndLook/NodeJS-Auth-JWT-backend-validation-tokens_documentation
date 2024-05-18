import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
    // DI
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest("Email already exists");
        try {
            const user = new UserModel(registerUserDto);
            
            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            // JWT <----- para mantener la autenticación del usuario

            // Enviar email de confirmación

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: "JWT",
            };
        } catch (error) {
            throw CustomError.internalServer(` ${error} `);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const existUser = await UserModel.findOne({ email: loginUserDto.email });
        if (!existUser) throw CustomError.badRequest("Email not found");

        try {

            // Verificar la contraseña
            const isPasswordValid = bcryptAdapter.compare(loginUserDto.password, existUser.password);
            if (!isPasswordValid) throw CustomError.badRequest("Invalid password");

            const {password, ...userEntity} = UserEntity.fromObject(existUser);

            return {
                user: userEntity,
                token: "JWT",
            };


        // JWT <----- para mantener la autenticación del usuario

        } catch (error) {
            throw CustomError.internalServer(` ${error} `);
        }
        
    }
}
