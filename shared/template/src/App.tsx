import { useTranslation } from 'react-i18next';
import '@plitvice/ui/styles/global.css';
import { CopyText, ModifiedField, SearchField, SideNavBar, SideNavMap } from '@plitvice/ui';

function App() {
    const { t } = useTranslation();

    return (
        <div className="relative mx-auto flex h-[100dvh] max-w-[1200px] flex-col items-center justify-center gap-3">
            <h1 className="box-border w-full whitespace-nowrap break-words bg-gradient-to-r from-[rgb(0,111,185)] via-[rgb(111,44,135)] to-[rgb(221,37,20)] bg-clip-text text-center text-[10rem] leading-[1.2] text-transparent">
                {t('common.appName')}
            </h1>
            <SearchField width={400} size={'large'} />
            <ExampleCopyText />
            <ExampleModifiedField />
            <SideNavBar width={240} navMap={navMap} onNavigate={console.log} />
        </div>
    );
}

export default App;

const ExampleModifiedField = () => {
    return <ModifiedField width={400} value={'origin text'} />;
};

const ExampleCopyText = () => {
    return <CopyText value={'Click to copy'} className={'text-red-500'} />;
};

const navMap: SideNavMap[] = [
    {
        path: '/pages',
        label: 'nav.pages',
        child: [
            { path: '/pages/home', label: 'nav.home' },
            { path: '/pages/linear', label: 'nav.channels' },
            { path: '/pages/avod', label: 'nav.onDemand' },
        ],
    },
    {
        path: '/library',
        label: 'nav.library',
        child: [
            { path: '/library/linear', label: 'nav.channels' },
            { path: '/library/series', label: 'nav.series' },
            { path: '/library/program', label: 'nav.programs' },
        ],
    },
    {
        path: '/categories',
        label: 'nav.categories',
    },
    {
        path: '/tags',
        label: 'nav.tags',
    },
    {
        path: '/searchKeywords',
        label: 'nav.searchKeywords',
    },
    {
        path: '/legals',
        label: 'nav.legals',
    },
];
