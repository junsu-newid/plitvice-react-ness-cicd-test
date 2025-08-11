import { LoaderFunctionArgs, useLoaderData } from 'react-router';
import { PresetItem, PresetResponse } from '@/api/models/preset.ts';
import { useTranslation } from 'react-i18next';
import EncodingPresetList from '@/pages/presetList/List.tsx';
import EncodingPresetMetadataSheet from '@/pages/presetList/Metadata.tsx';
import { useState } from 'react';
import { fetchPresetList } from '@/api/services/preset.ts';
import { getSession } from '@/session.server.ts';
import { COOKIE, ENCRYPT_KEY } from '@/types/enum.ts';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get(COOKIE));
    const userEncryptKey = await session.get(ENCRYPT_KEY);
    return await fetchPresetList(userEncryptKey);
};

const EncodingPresetPage = () => {
    const { t } = useTranslation();
    const presetData = useLoaderData() as PresetResponse;
    const [selectedItem, setSelectedItem] = useState<PresetItem>();

    const handleDrawerClose = (): void => {
        setSelectedItem(undefined);
    };

    return (
        <div className="bg-grey-5 flex h-full min-w-[1200px] flex-col p-[36px]">
            <h1>{t('presetList.title')}</h1>
            <p className={`text-r14 text-grey-60 whitespace-pre-line pb-[24px] pt-[12px]`}>
                {t('presetList.description')}
            </p>
            <div className="border-grey-20 relative h-full overflow-auto rounded-[4px] border bg-white">
                {(!presetData.data || presetData.data.length === 0) && (
                    <div className="text-grey-50 flex h-full items-center justify-center">
                        {t('presetList.emptyList')}
                    </div>
                )}
                <EncodingPresetList data={presetData.data} onItemClick={setSelectedItem} />
            </div>
            <EncodingPresetMetadataSheet content={selectedItem} onClose={handleDrawerClose} />
        </div>
    );
};
export default EncodingPresetPage;
