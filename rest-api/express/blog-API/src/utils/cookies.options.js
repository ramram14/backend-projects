import env from '../config/dotenv.js'
import env from '../config/dotenv.js'
import ms from 'ms'

export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: false,
    maxAge: ms(env.JWT_ACCESS_TOKEN_EXPIRY)
};

export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: false,
    path: '/api/auth/refresh-token',
    maxAge: ms(env.JWT_REFRESH_TOKEN_EXPIRY)
};
