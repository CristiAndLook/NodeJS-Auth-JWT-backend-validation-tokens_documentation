import jwt from 'jsonwebtoken'


export class JwtAdapter {

    static async genererateToken(payload: any, durantion: string = '1h') {

        return new Promise ((resolve) => {
            jwt.sign(payload, "SEED", {expiresIn: durantion}, (err, token) => {
                
                if (err) return resolve(null)

                resolve(token)
            })
        }) 
    }
}