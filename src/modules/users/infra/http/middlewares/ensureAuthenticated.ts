import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload{
    iat: Number;
    exp: Number;
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next:NextFunction){

    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new AppError('token is missing', 401);
    }

    const [,token] = authHeader.split(' ');

    try{
        const decoded = verify(token, authConfig.jwt.secret);

        const {sub} = decoded as TokenPayload;

        request.user = {
            id: sub,
        }

        return next();
    }catch{
        throw new AppError('invalid token', 401);
    }

}
