import { useLoaderData } from 'react-router';
import { PresetItem, PresetResponse } from '@/api/models/preset.ts';
import { useTranslation } from 'react-i18next';
import EncodingPresetList from '@/pages/encoding/features/presetList/List.tsx';
import EncodingPresetMetadataSheet from '@/pages/encoding/features/presetList/Metadata.tsx';
import { useState } from 'react';

const EncodingPreset = () => {
    const { t } = useTranslation();
    const presetData = useLoaderData() as PresetResponse;
    const [selectedItem, setSelectedItem] = useState<PresetItem>();

    const handleDrawerClose = (): void => {
        setSelectedItem(undefined);
    };

    return (
        <div className="flex h-screen min-w-[1200px] flex-col bg-gray-50 p-[36px]">
            <h1 className="text-b28">{t('presetList.title')}</h1>
            <p className={`text-r14 text-grey-60 whitespace-pre-line pb-[24px] pt-[12px]`}>
                {t('presetList.description')}
            </p>
            <div className="relative h-full overflow-auto rounded-[4px] border border-gray-200 bg-white">
                {(!presetData.data || presetData.data.length === 0) && (
                    <div className="flex h-32 items-center justify-center text-gray-500">업로드된 파일이 없습니다.</div>
                )}
                <EncodingPresetList data={presetData.data} onItemClick={setSelectedItem} />
            </div>
            <EncodingPresetMetadataSheet content={selectedItem} onClose={handleDrawerClose} />
        </div>
    );
};
export default EncodingPreset;
