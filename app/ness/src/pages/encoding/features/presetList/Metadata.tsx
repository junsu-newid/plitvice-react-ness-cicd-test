import { PresetItem } from '@/api/models/preset.ts';
import { useTranslation } from 'react-i18next';
import { firstUpperCase } from '@/utils';
import { Drawer, Button, TextCopier, StatusChip, useToast } from '@plitvice/ui';

type Props = {
    content?: PresetItem;
    onClose: () => void;
};

function EncodingPresetMetadataSheet({ content, onClose }: Props) {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const EncodingOption = () => {
        const options = content?.options || {};

        return (
            <div className={`flex flex-col gap-[2px] p-[16px]`}>
                {Object.entries(options).map(([key, value], index) => {
                    return (
                        <div key={`encoding-option-${index}`} className={`flex items-start`}>
                            <p className={`text-m14 text-grey-50 w-[90px]`}>{firstUpperCase(key)}: </p>
                            <p className={`text-r14`}>
                                {Array.isArray(value)
                                    ? value.map((item: string, index) => (
                                          <StatusChip color={'grey'} key={`encoding-option-res-${index}`}>
                                              {item}
                                          </StatusChip>
                                      ))
                                    : value}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Drawer width={552} open={content !== undefined} onClose={onClose} className={`px-[36px] py-[48px]`}>
            <div className={`flex items-center justify-between`}>
                <h2>{content?.name}</h2>
                <Button fill={false} variant={'normal'} onClick={onClose}>
                    {t('button.close')}
                </Button>
            </div>
            {content?.options ? (
                <div className={`border-grey-20 mt-[34px] rounded-[4px] border bg-white`}>
                    <div className={`bg-grey-10 p-[16px]`}>
                        <h3>{t('presetList.drawerTitle0')}</h3>
                    </div>
                    <EncodingOption />
                </div>
            ) : null}
            <div className={`border-grey-20 mt-[34px] rounded-[4px] border bg-white`}>
                <div className={`bg-grey-10 p-[16px]`}>
                    <h3>{t('presetList.drawerTitle1')}</h3>
                </div>
                <div className={`p-[16px]`}>
                    <TextCopier
                        value={content?.ffmpegCommand ?? ''}
                        onSuccess={() => showToast(t('presetList.toastClipboard'), 'info')}
                        className={`line-clamp-16`}
                    />
                </div>
            </div>
        </Drawer>
    );
}
export default EncodingPresetMetadataSheet;
