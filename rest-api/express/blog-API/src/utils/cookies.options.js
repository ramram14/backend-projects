import env from '../config/dotenv.js'
import ms from 'ms'

export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: ms(env.JWT_ACCESS_TOKEN_EXPIRY)
};

export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'None',
    path: '/api/v1/auth/refresh-token',
    maxAge: ms(env.JWT_REFRESH_TOKEN_EXPIRY)
};
