import { TFunction } from 'i18next';
import { SideNavSection } from '@plitvice/ui/components/navigation/sideNavBar.types.ts';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import Layout from '@/app/Layout.tsx';
import { SideNavBar } from '@plitvice/ui/components/navigation/SideNavBar.tsx';

function HomeLayout() {
    const { t } = useTranslation();
    const navMap = useMemo(() => getNavMap(t), [t]);
    const navigate = useNavigate();
    // const { isAuthenticated, isLoading, error, authenticate } = useUser();

    return (
        <Layout>
            <div className={`overflow-y-auto pb-[48px] pt-[24px]`}>
                <SideNavBar width={0} sectionList={navMap} onNavigate={navigate} />
            </div>
        </Layout>
    );
}
export default HomeLayout;

const getNavMap = (t: TFunction): SideNavSection[] => {
    return [
        {
            title: t('nav.home.encoding.title'),
            child: [
                { path: '/', label: t('nav.home.encoding.upload') },
                { path: '/file-list', label: t('nav.home.encoding.list') },
            ],
        },
        {
            title: t('nav.home.operations.title'),
            child: [
                { path: '/server-status', label: t('nav.home.operations.serverStatus') },
                { path: '/preset-list', label: t('nav.home.operations.presetList') },
            ],
        },
    ];
};
