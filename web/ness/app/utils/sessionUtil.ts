import { LoaderFunctionArgs } from 'react-router';

import { COOKIE, ENCRYPT_KEY } from '@/types/enum';

import { getSession } from '@/session.server';

export const getUserEncryptKeyFromSession = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get(COOKIE));
    // 임시
    session.set(
        ENCRYPT_KEY,
        'VD6Xte9MNwFZYf8DyrFyOL-eh_C6tQkKoC5P_bjW-Cf5YzPOo7gBw8CdwisbBv1qMGF-JD6WBvFI23O-MdvUYcgzQpnvN1UOzs38HALjvU4UE-DemNJwHcFvzPpZFBdwYDI3c1gZabPeqW-Etu405hpxJm-Ls9zDxD0udfGZd4YT60igPioqIM9D0Wr1-lKj5cvxAoWfa8DArnt2Gq2kD45hUvbpaA5jhXAG5-zknQ62Z9Zzo2Ww8NQUVeLskUuxs_tFAYmRpGI5LLvtNaDIPN2SIi6opxllySUfnX-PXQe_fAGIl1CpIzLjx7CjOFBCQXAVK5MsYmpn8zkoFecXT8qRyT4SYP4f_ErOWVsefUCzzkDt_FmBXGlX9mo-EUhaD4zQ2znKUoxjXFm-TgLZ3RKaaiWAMTsFBO9fhyncweKBaj3MeD_0z7qZ1xcr6csWKqH42bMjkSg=',
    );
    return session.get(ENCRYPT_KEY) as string;
};
