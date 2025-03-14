import env from '../config/dotenv.js'
import ms from 'ms'

const expiryDate = new Date();
/**
 * Configuration options for setting the access token cookie.
 * These options are used to configure the behavior of the access token cookie, such as 
 * its expiration, security settings, and cross-site request handling.
 *
 * @constant accessTokenCookieOptions
 * @type {object}
 * @property {boolean} httpOnly - Ensures that the cookie is only accessible by the server.
 * @property {boolean} secure - Enables the cookie to be sent only over HTTPS, enabled in production.
 * @property {string} sameSite - Configures the SameSite attribute of the cookie, set to 'None' for cross-site requests.
 * @property {number} maxAge - Defines the maximum age of the cookie (duration of access token validity).
 */
export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: ms(env.JWT_ACCESS_TOKEN_EXPIRY)
};

/**
 * Configuration options for setting the refresh token cookie.
 * These options define the behavior of the refresh token cookie, including its expiry,
 * security settings, and path for which it is valid.
 *
 * @constant refreshTokenCookieOptions
 * @type {object}
 * @property {boolean} httpOnly - Ensures the cookie is only accessible by the server.
 * @property {boolean} secure - Ensures the cookie is sent only over HTTPS, enabled in production.
 * @property {string} sameSite - Specifies the SameSite attribute for handling cross-site requests, set to 'None'.
 * @property {string} path - The path on which the cookie is valid, defaulting to root ('/').
 * @property {number} maxAge - Defines the maximum duration for the refresh token validity.
 */
export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
    maxAge: ms(env.JWT_REFRESH_TOKEN_EXPIRY)
};
