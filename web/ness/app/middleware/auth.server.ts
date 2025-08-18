import type { LoaderFunctionArgs } from 'react-router';

import { HTTPError } from 'ky';

import { getUserEncryptKeyFromSession } from '@/utils/sessionUtil.server.ts';

type LoaderContext = LoaderFunctionArgs & Record<string, unknown>;
type Loader<T extends object = object> = (args: LoaderContext & T) => Promise<Response | unknown>;
type Middleware = (next: Loader<object>) => Loader<object>;

export const compose =
    (...mws: Middleware[]) =>
    (next: Loader<object>): Loader<object> =>
        mws.reduceRight<Loader<object>>((acc, mw) => mw(acc), next);

export const withUserSession: Middleware = (next) => async (args) => {
    const { userEncryptKey, cookie } = await getUserEncryptKeyFromSession(args as LoaderFunctionArgs);
    return next({ ...args, userEncryptKey, cookie });
};

export const errorHandler: Middleware = (next) => async (args) => {
    try {
        return await next(args);
    } catch (error) {
        if (error instanceof HTTPError && error.response.status === 401) {
            return new Response('', { status: 302, headers: { Location: '/ness/' } });
        }
        return error;
    }
};

export const commonLoader = <T extends object = object>(handler: Loader<T>): Loader =>
    compose(withUserSession, errorHandler)(handler as Loader<object>);
