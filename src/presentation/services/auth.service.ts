import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
    // DI
    constructor(
        // DI Email Service
        private readonly emailService: EmailService,

    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest("Email already exists");
        try {
            const user = new UserModel(registerUserDto);

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            // Enviar email de confirmación
            await this.sendEmailValidationLink(user.email);

            // JWT <----- para mantener la autenticación del usuario


            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.genererateToken({ id: userEntity.id });
            if (!token) throw CustomError.internalServer("Error generating token");

            return {
                user: userEntity,
                token: token,
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

            const { password, ...userEntity } = UserEntity.fromObject(existUser);

            const token = await JwtAdapter.genererateToken({ id: userEntity.id });
            if (!token) throw CustomError.internalServer("Error generating token");

            return {
                user: userEntity,
                token: token,
            };


            // JWT <----- para mantener la autenticación del usuario

        } catch (error) {
            throw CustomError.internalServer(` ${error} `);
        }



    }

    private sendEmailValidationLink = async (email: string) => {
        const token = await JwtAdapter.genererateToken({ email });
        if (!token) throw CustomError.internalServer("Error generating token");

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
        h1>Validate your email</h1>
        p>Click on the following link to validate your email</p>
        a href="${link}">Validate email</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer("Error sending email");

        return true;

    }
}
