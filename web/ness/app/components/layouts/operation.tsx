import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Outlet, redirect, useNavigate } from 'react-router';

import { TFunction } from 'i18next';

import { SideNavBar } from '@plitvice/ui/components/navigation/SideNavBar.tsx';
import { SideNavSection } from '@plitvice/ui/components/navigation/sideNavBar.types.ts';

import { withSession } from '@/libs/auth.server.ts';
import { isNEWID } from '@/utils';

export const loader = withSession(
    async ({ userEncryptKey, userGroup }: { userEncryptKey: string; userGroup: string[] }) => {
        if (isNEWID(userGroup)) {
            return { userEncryptKey, userGroup };
        } else {
            return redirect('deny');
        }
    },
);

const Layout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const navMapList = useMemo(() => getNavMap(t), [t]);

    return (
        <div className={'relative grid h-full w-full grid-cols-[240px_1fr] justify-start overflow-hidden'}>
            <div className={`h-full overflow-y-auto pb-[48px] pt-[24px]`}>
                <SideNavBar width={0} sectionList={navMapList} onNavigate={navigate} />
            </div>
            <main className={'bg-grey-5 border-grey-20 relative h-full w-full overflow-auto border-l'}>
                <Outlet />
            </main>
        </div>
    );
};
export default Layout;

const getNavMap = (t: TFunction): SideNavSection[] => {
    return [
        {
            title: t('nav:operation.title'),
            child: [
                { path: 'queue-status', label: t('nav:operation.queueStatus') },
                { path: 'server-status', label: t('nav:operation.serverStatus') },
                { path: 'preset-list', label: t('nav:operation.presetList') },
            ],
        },
    ];
};
