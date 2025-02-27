import {Injectable, UnauthorizedException} from '@nestjs/common';
import type {StrategyOptions} from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {UserService} from '../services/UserService'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private readonly config: ConfigService,
        private readonly userService:UserService,)  {
        // @ts-ignore
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        } as StrategyOptions);
    }

    async validate(payload: any) {
        const user = await this.userService.getUserById(payload.userId);
        console.log(payload)
        if(!user) {
            return null;
        }
        return {
            ...user,
            password:undefined
        }
    }
}
