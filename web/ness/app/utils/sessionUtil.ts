import { LoaderFunctionArgs } from 'react-router';

import { COOKIE, ENCRYPT_KEY } from '@/types/enum';

import { commitSession, getSession } from '@/session.server';

type GetUserEncryptKeyResult = {
    userEncryptKey: string;
    cookie?: string;
};

export const getUserEncryptKeyFromSession = async ({
    request,
}: LoaderFunctionArgs): Promise<GetUserEncryptKeyResult> => {
    const url = new URL(request.url);
    const session = await getSession(request.headers.get(COOKIE));
    const keyFromQuery = url.searchParams.get(ENCRYPT_KEY);

    if (keyFromQuery) {
        session.set(ENCRYPT_KEY, keyFromQuery);
        const cookie = await commitSession(session);
        return { userEncryptKey: keyFromQuery, cookie };
    }

    const keyFromSession = (session.get(ENCRYPT_KEY) as string | undefined) ?? '';
    return { userEncryptKey: keyFromSession };
};
