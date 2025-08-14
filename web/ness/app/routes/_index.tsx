import { redirect } from 'react-router';

import { commonLoader } from '@/middleware/auth';

export const loader = commonLoader(async ({ setCookie }: { setCookie?: string }) => {
    return redirect('file-upload', {
        headers: setCookie ? { 'Set-Cookie': setCookie } : undefined,
    });
});

export default function AppIndex() {
    return <></>;
}
