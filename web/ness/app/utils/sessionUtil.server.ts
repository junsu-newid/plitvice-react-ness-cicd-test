import { LoaderFunctionArgs, SessionData } from 'react-router';

import { COOKIE, ENCRYPT_KEY } from '@/types/enum';

import { commitSession, getSession } from '@/libs/session.server.ts';

export const getSessionData = async ({ request }: LoaderFunctionArgs): Promise<SessionData> => {
    let userEncryptKey: string | null = '';
    console.log('111');
    if (process.env.NODE_ENV === 'production') {
        console.log('222');
        const url = new URL(request.url);
        console.log('url', url);
        userEncryptKey = url.searchParams.get(ENCRYPT_KEY);
    } else {
        userEncryptKey =
            'VuWLWqo7OjxXPjtWU2wI3ia3zZh4NsVYk64ecipkKmrAazIJgjdoZYTDhzdW_EhPJOyLaip5uNMtOk0Q0zfhaSlfnVk79TVId2j29eL9XXuewJb-uFBBIAYc1qtKNyhzCgtMgqLwVMKqpJ13v76H88QueShzRpVLKxkU6vrowxwQxiT4rXi94az7G3udAYUBBjJt8dNfNUzhmYcWuvpD4ifObZeYtm9zBL6BORMO4jLMQc1By48IioTEybvXQ9kPw0BCGU40QEcZttPnnVehGNCHiHl5NrzW3MN3ZOP1REs3-iDOKpIcAoQjLHzeFnMU5E7xJjlZehT6SdxEljuOBLO7PQFw7nwD36Fy1b8Clw==';
    }

    const session = await getSession(request.headers.get(COOKIE));
    if (userEncryptKey) {
        session.set(ENCRYPT_KEY, userEncryptKey);
        console.log('userEncryptKey@@@', userEncryptKey);
        await commitSession(session);
        return { userEncryptKey: userEncryptKey, session };
    }

    return { userEncryptKey: session.get(ENCRYPT_KEY) as string, session: null };
};
