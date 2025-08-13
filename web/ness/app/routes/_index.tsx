import { LoaderFunctionArgs, redirect } from 'react-router';

import { COOKIE, ENCRYPT_KEY } from '@/types/enum.ts';

import { commitSession, getSession } from '@/session.server.ts';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get(COOKIE));
    const url = new URL(request.url);
    const userEncryptKey = url.searchParams.get(ENCRYPT_KEY);

    if (userEncryptKey && !session.has(ENCRYPT_KEY)) {
        session.set('userEncryptKey', userEncryptKey);
    } else {
        session.set(
            ENCRYPT_KEY,
            '8-TVgRMrDIMZbg3dLSfO6_7jZd69tt7Y8Oys7RnzsDkAfSgbOkv5XH2ZAUGOhto5hiw5Fo1yVG_j8RdHDjosCnIlAQgasTR3CPVKSB0vJ2ajMIsHTTJusE5kr-ZaoCbA72ohTkew6HbmprptdDPpzzDzFj_cl0SSC-opkDEUCho_EfEW5xWrAOdd1qicjGAyPym_OpUZFgBQkf9ArH8z2atpgnaPbeekaU8c-qY7kr23OlB2aSTWOPPrjrshvKwp1Z_0-6P5Isj8rJ57Gjegtih7C2rsNmE2DSAHrNA9yruBlZIpl-rNCMCL7VrqrP1BzVkcUozq57V18jlTjy5P4d2emGOL0UCkjKgKws1Uwg==',
        );
    }

    return redirect('file-upload', { headers: { 'Set-Cookie': await commitSession(session) } });
}

export default function AppIndex() {
    return <></>;
}
