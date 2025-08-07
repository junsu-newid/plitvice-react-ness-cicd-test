import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { SelectOption, TabMenu, WarningIcon } from '@plitvice/ui';
import FileUploadingList from './uploading.tsx';
import FileUploadedList from './uploaded.tsx';
import useFileUpload from '@/pages/fileUpload/index.hook.ts';
import { fetchPresetList } from '@/api/services/preset.ts';
import { data, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { getSession } from '@/session.server.ts';
import { COOKIE, ENCRYPT_KEY } from '@/types/enum.ts';

enum TabMenuType {
    UPLOADING = 'uploading',
    UPLOADED = 'uploaded',
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get(COOKIE));
    const userEncryptKey = await session.get(ENCRYPT_KEY);
    const res = await fetchPresetList(userEncryptKey);
    const presetList: SelectOption[] = [];
    res.data.map((item) => {
        presetList.push({ value: item.id, label: item.name });
    });
    return data({ userEncryptKey, presetList });
};

const FileUploadPage = () => {
    const { t } = useTranslation();
    const { userEncryptKey, presetList } = useLoaderData();
    const { isUploading, fileList, setFileList, removeFile, runUpload, pauseUpload } = useFileUpload(userEncryptKey);
    const [tabMenu, setTabMenu] = useState(TabMenuType.UPLOADING);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = t('fileUpload.alertNowUploading');
        };

        if (isUploading) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [t, isUploading]);

    return (
        <div className="bg-grey-5 relative flex h-full min-w-[1200px] flex-1 flex-col p-[36px]">
            <h1>{t('fileUpload.title')}</h1>
            <p className={`text-r14 text-grey-60 mt-[12px] whitespace-pre-line pb-[24px]`}>
                {t('fileUpload.description')}
            </p>
            {userEncryptKey !== 'cp' ? (
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
                    <FileUploadedList userEncryptKey={userEncryptKey} presetList={presetList} />
                )}
            </div>
            {isUploading ? (
                <div className={`fixed right-[36px] top-[96px] flex items-center gap-[4px]`}>
                    <WarningIcon className={`animate-[warning-color-anim_2s_ease-in-out_infinite]`} />
                    <p className={`text-r14`}>{t('fileUpload.alertNowUploading')}</p>
                </div>
            ) : null}
        </div>
    );
};
export default FileUploadPage;

const getTabMenu = (t: TFunction): SelectOption[] => {
    return [
        {
            value: TabMenuType.UPLOADING,
            label: t('fileUpload.section0.title'),
        },
        {
            value: TabMenuType.UPLOADED,
            label: t('fileUpload.section1.title'),
        },
    ];
};
