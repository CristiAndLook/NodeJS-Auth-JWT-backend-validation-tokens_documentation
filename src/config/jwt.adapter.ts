import jwt from 'jsonwebtoken'
import { envs } from './envs'


const JWT_SECRET = envs.JWT_SECRET


export class JwtAdapter {

    static async genererateToken(payload: any, durantion: string = '1h') {

        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SECRET, { expiresIn: durantion }, (err, token) => {

                if (err) return resolve(null)

                resolve(token)
            })
        })
    }

    static validateToken(token: string) {

        return new Promise((resolve) => {

            jwt.verify(token, JWT_SECRET, (err, decoded) => {

                if (err) return resolve(null);

                resolve(decoded);

            });

        })
    }
}