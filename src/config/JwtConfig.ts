import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'JWT_SECRET',
        });
    }

    async validate(payload: any) {
        console.log('JwtStrategy validate payload:', payload);
        if (!payload) {
            throw new UnauthorizedException('无效的 Token');
        }
        // return { id: payload.userId, userAccount: payload.userAccount,role:payload.role };
        return {
            id:payload.userId,
            userAccount:payload.userAccount,
            role:payload.role
        };
    }
}
