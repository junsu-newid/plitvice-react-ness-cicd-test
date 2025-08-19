import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PresetItem, PresetResponse } from '@/api/models/preset.ts';
import { fetchPresetList } from '@/api/services/preset.ts';

import { useRootLoaderData } from '@/hooks/useRootLoaderData.ts';

import { Detail } from '@/routes/presetList/_detail.tsx';
import { Table } from '@/routes/presetList/_table.tsx';

const EncodingPresetPage = () => {
    const { t } = useTranslation();
    const { userEncryptKey } = useRootLoaderData();
    const [presetData, setPresetData] = useState<PresetResponse | null>(null);
    const [selectedItem, setSelectedItem] = useState<PresetItem>();

    const handleDrawerClose = (): void => {
        setSelectedItem(undefined);
    };

    useEffect(() => {
        if (!userEncryptKey) return;

        fetchPresetList(userEncryptKey).then((res) => {
            setPresetData(res);
        });
    }, [userEncryptKey]);

    return (
        <div className="bg-grey-5 flex h-full min-w-[1200px] flex-col p-[36px]">
            <h1>{t('presetList:title')}</h1>
            <p className={`text-r14 text-grey-60 whitespace-pre-line pb-[24px] pt-[12px]`}>
                {t('presetList:description')}
            </p>
            <div className="border-grey-20 relative h-full overflow-auto rounded-[4px] border bg-white">
                {(!presetData?.data || presetData?.data.length === 0) && (
                    <div className="text-grey-50 flex h-full items-center justify-center">
                        {t('presetList:emptyList')}
                    </div>
                )}
                <Table data={presetData?.data} onItemClick={setSelectedItem} />
            </div>
            <Detail content={selectedItem} onClose={handleDrawerClose} />
        </div>
    );
};
export default EncodingPresetPage;
