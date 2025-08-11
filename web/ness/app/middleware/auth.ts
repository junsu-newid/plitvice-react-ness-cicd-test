import type { LoaderFunctionArgs } from 'react-router';

import { getUserEncryptKeyFromSession } from '@/utils/sessionUtil';

type LoaderContext = LoaderFunctionArgs & Record<string, unknown>;
type Loader<T extends object = object> = (args: LoaderContext & T) => Promise<Response | unknown>;
type Middleware = (next: Loader<any>) => Loader<any>;

export const compose =
    (...mws: Middleware[]) =>
    (next: Loader<any>): Loader<any> =>
        mws.reduceRight<Loader<any>>((acc, mw) => mw(acc), next);

export const withUserSession: Middleware = (next) => async (args) => {
    const userEncryptKey = await getUserEncryptKeyFromSession(args as LoaderFunctionArgs);
    return next({ ...args, userEncryptKey });
};

export const errorHandler: Middleware = (next) => async (args) => {
    try {
        return await next(args);
    } catch {
        return new Response('', { status: 302, headers: { Location: '/ness/login' } });
    }
};

export const commonLoader = <T extends object = object>(handler: Loader<T>): Loader =>
    compose(withUserSession, errorHandler)(handler as Loader<any>);
