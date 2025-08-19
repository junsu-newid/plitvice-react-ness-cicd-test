import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TFunction } from 'i18next';

import { TabMenu } from '@plitvice/ui/components/navigation/TabMenu.tsx';
import { SelectOption } from '@plitvice/ui/components/selectbox/DropdownList.tsx';

import { WarningIcon } from '@plitvice/ui/index.ts';

import { fetchPresetList } from '@/api/services/preset.ts';

import { useRootLoaderData } from '@/hooks/useRootLoaderData.ts';

import { UploadingTable } from '@/routes/fileUpload/_uploaded.table.tsx';
import { FileUploadingList } from '@/routes/fileUpload/_uploading.table.tsx';
import { useFileUpload } from '@/routes/fileUpload/index.hook.ts';

import '@/styles/global.css';
import { isNEWID } from '@/utils';

enum TabMenuType {
    UPLOADING = 'uploading',
    UPLOADED = 'uploaded',
}

const Index = () => {
    const { t } = useTranslation();
    const { userEncryptKey, userGroup } = useRootLoaderData();
    const [tabMenu, setTabMenu] = useState(TabMenuType.UPLOADING);
    const presetList = useMemo<SelectOption[]>(() => [], []);
    const { isUploading, fileList, setFileList, removeFile, runUpload, pauseUpload } = useFileUpload(userEncryptKey);

    useEffect(() => {
        if (!userEncryptKey) return;

        fetchPresetList(userEncryptKey).then((res) => {
            res.data.map((item) => {
                presetList.push({ value: item.id, label: item.name });
            });
        });
    }, [presetList, userEncryptKey]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = t('fileUpload:alertNowUploading');
        };

        if (isUploading) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [t, isUploading]);

    return (
        <main className={'bg-grey-5 h-full w-full overflow-auto'}>
            <div className="relative flex h-full min-w-[800px] flex-1 flex-col p-[36px]">
                <h1>{t('fileUpload:title')}</h1>
                <p className={`text-r14 text-grey-60 mt-[12px] whitespace-pre-line pb-[24px]`}>
                    {t('fileUpload:description')}
                </p>
                {isNEWID(userGroup) ? (
                    <>
                        <div className={`relative`}>
                            <TabMenu
                                tabList={getTabMenu(t)}
                                value={tabMenu}
                                onChange={(value) => setTabMenu(value as TabMenuType)}
                            />
                        </div>
                        <div className={`border-grey-20 border-t pb-[16px]`} />
                    </>
                ) : null}
                <div className="flex h-full flex-col gap-[16px] overflow-auto">
                    {tabMenu === TabMenuType.UPLOADING ? (
                        <FileUploadingList
                            isUploading={isUploading}
                            fileList={fileList}
                            setFileList={setFileList}
                            removeFile={removeFile}
                            runUpload={runUpload}
                            pauseUpload={pauseUpload}
                        />
                    ) : (
                        <UploadingTable userEncryptKey={userEncryptKey} presetList={presetList} />
                    )}
                </div>
                {isUploading ? (
                    <div className={`fixed right-[36px] top-[96px] flex items-center gap-[4px]`}>
                        <WarningIcon className={`animate-[warning-color-anim_2s_ease-in-out_infinite]`} />
                        <p className={`text-r14`}>{t('fileUpload:alertNowUploading')}</p>
                    </div>
                ) : null}
            </div>
        </main>
    );
};
export default Index;

const getTabMenu = (t: TFunction): SelectOption[] => {
    return [
        {
            value: TabMenuType.UPLOADING,
            label: t('fileUpload:section0.title'),
        },
        {
            value: TabMenuType.UPLOADED,
            label: t('fileUpload:section1.title'),
        },
    ];
};
