import { redirect, type LoaderFunctionArgs, Session } from 'react-router';

import { decodeKey } from '@/utils/decryptor.server.ts';
import { getSessionData } from '@/utils/sessionUtil.server.ts';

type LoaderCallback<T> = (
    args: LoaderFunctionArgs & { userEncryptKey: string; userGroup: string[]; lang: string; session: Session },
) => Promise<T>;

export const withSession = <T>(callback: LoaderCallback<T>) => {
    return async (args: LoaderFunctionArgs) => {
        const { userEncryptKey, session } = await getSessionData(args as LoaderFunctionArgs);

        if (!userEncryptKey && !args.request.url.includes('/error')) {
            return redirect('/error');
        }

        // TODO: - language 가져오기
        const lang = session.get('lang') || 'en';
        const decryptedText = await decodeKey(userEncryptKey);

        return callback({ ...args, userEncryptKey, userGroup: decryptedText.userGroup as string[], lang, session });
    };
};
