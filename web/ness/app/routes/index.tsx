import { Outlet } from 'react-router';

import { withSession } from '@/libs/auth.server.ts';

export const loader = withSession(
    async ({ userEncryptKey, userGroup }: { userEncryptKey: string; userGroup: string[] }) => {
        return { userEncryptKey, userGroup };
    },
);

export type RootLoaderData = typeof loader;

const Index = () => {
    return <Outlet />;
};
export default Index;
