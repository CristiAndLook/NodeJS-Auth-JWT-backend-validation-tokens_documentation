import { Router } from 'express';
import { AuthController } from './controller';


export class AuthRoutes {


    static get routes(): Router {

        const controller = new AuthController;
        const router = Router();

        // Definir las rutas
        router.post('/login', controller.loginUser); 
        router.post('/register', controller.registerUser );

        router.get('/validate-email/:token', controller.validateEmail );

        return router;
    }


}
