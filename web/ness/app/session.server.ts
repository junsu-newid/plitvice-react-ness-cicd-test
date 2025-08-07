import { createCookieSessionStorage } from 'react-router';

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: '_t',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets: ['SwissRedOctopus!'],
        maxAge: 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production',
    },
});
export const { getSession, commitSession, destroySession } = sessionStorage;
