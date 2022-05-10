import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { TokenPayload } from '../interfaces/jwtTokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication; // what are these question marks
          // sign cookies? https://docs.nestjs.com/techniques/cookies#use-with-express-default
        },
      ]),
      // supplies the method by which the JWT will be extracted from the Request
      ignoreExpiration: false,
      // false is the default value: the Passport module will ensure that a JWT
      // has not expired. If our route is supplied with an expired JWT, the
      // request will be denied and a 401 Unauthorized response sent. Passport
      // conveniently handles this automatically for us.
      secretOrKey: jwtConstants.secret,
      // secretOrKey: configService.get('JWT_SECRET')
    }); // https://github.com/mikenicholson/passport-jwt#configure-strategy
  }

  async validate(payload: TokenPayload) {
    return { login42: payload.login42 };
    // Passport will build a user object based on the return value of our
    // validate() method, and attach it as a property on the Request object.
  }
  // We could inject other business logic into the process. For example, we
  // could do a database lookup in our validate() method to extract more
  // information about the user, resulting in a more enriched user object being
  // available in our Request. This is also the place we may decide to do
  // further token validation, such as looking up the userId in a list of
  // revoked tokens, enabling us to perform token revocation. The model we've
  // implemented here in our sample code is a fast, "stateless JWT" model, where
  // each API call is immediately authorized based on the presence of a valid
  // JWT, and a small bit of information about the requester (its userId and
  // username) is available in our Request pipeline.
}
// Passport first verifies the JWT's signature and decodes the JSON. It then
// invokes our validate() method passing the decoded JSON as its single
// parameter.  Based on the way JWT signing works, we're guaranteed that we're
// receiving a valid token that we have previously signed and issued to a valid
// user.
