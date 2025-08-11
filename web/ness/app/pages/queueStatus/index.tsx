import { useEffect, useState } from 'react';
import { data, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { QueueFileItem, FileListResponse } from '@/api/models/queueList.ts';
import { useTranslation } from 'react-i18next';
import { DateRange, DateRangePickerBox } from '@plitvice/ui';
import QueueStatusList from '@/pages/queueStatus/List.tsx';
import { COOKIE, ENCRYPT_KEY, QueueStatusType } from '@/types/enum.ts';
import { startOfDay, subDays } from 'date-fns';
import { fetchFileList } from '@/api/services/queueList.ts';
import { formatDateForInput, getDefaultDateRange, parseDateFromInput } from '@/utils';
import StatusBox, { StatusBoxProps } from '@/components/StatusBox.tsx';
import QueueStatusMetadataSheet from '@/pages/queueStatus/Metadata.tsx';
import { getSession } from '@/session.server.ts';

type LoaderProps = {
    userEncryptKey: string;
    queueList: FileListResponse;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get(COOKIE));
    const userEncryptKey = await session.get(ENCRYPT_KEY);
    const { startDate, endDate } = getDefaultDateRange();
    return data({ userEncryptKey, queueList: await fetchFileList(userEncryptKey, startDate, endDate) });
};

const QueueStatusPage = () => {
    const { t } = useTranslation();
    const { userEncryptKey, queueList } = useLoaderData<LoaderProps>();
    const [data, setData] = useState(queueList);
    const allFiles = data.data.encodingFileList;
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [filteredData, setFilteredData] = useState<QueueFileItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<QueueFileItem>();

    useEffect(() => {
        setFilteredData(
            selectedStatus === 0
                ? allFiles
                : allFiles.filter((item) => item.status === StatusSetting[selectedStatus].type),
        );
    }, [allFiles, selectedStatus]);

    const today = startOfDay(new Date());
    const thirtyDaysAgo = startOfDay(subDays(today, 30));

    const INITIAL_DATE_RANGE: DateRange = {
        from: thirtyDaysAgo,
        to: today,
    };
    const [dateRange, setDateRange] = useState<DateRange>(INITIAL_DATE_RANGE);

    type onDateRangeChangeProps = {
        startDate: Date;
        endDate: Date;
    };
    const onDateRangeChange = async ({ startDate, endDate }: onDateRangeChangeProps) => {
        const { from: initFrom, to: initTo } = INITIAL_DATE_RANGE;
        const rangeFrom = startDate ?? initFrom;
        const rangeTo = endDate ?? initTo;

        if (!rangeFrom || !rangeTo) return;

        try {
            const startDate = parseDateFromInput(formatDateForInput(rangeFrom));
            const endDate = parseDateFromInput(formatDateForInput(rangeTo));
            const newData = await fetchFileList(userEncryptKey, startDate, endDate);
            setData(newData);
            setDateRange({ from: rangeFrom, to: rangeTo });
        } catch (error) {
            console.error('API call failed:', error);
        }
    };

    return (
        <div className={'bg-grey-5 flex h-full min-w-[1200px] flex-col gap-[12px] p-[36px]'}>
            <h1>{t('queueStatus.title')}</h1>
            <p className={`text-r14 text-grey-60 whitespace-pre-line pb-[12px]`}>{t('queueStatus.description')}</p>
            <div className="flex pb-[12px]">
                <DateRangePickerBox
                    placeholder="Set search date range"
                    width={276}
                    showTime={false}
                    value={dateRange}
                    onChange={(value) => {
                        if (value && value.from && value.to) {
                            onDateRangeChange({ startDate: value.from, endDate: value.to });
                        }
                    }}
                />
            </div>
            <div className={`flex w-[1128px] gap-[12px] pb-[12px]`}>
                {StatusSetting.map((box, index) => (
                    <StatusBox
                        title={t(`queueStatus.${box.type}`)}
                        titleSlice={box.titleSlice}
                        color={box.color}
                        count={
                            index === 0
                                ? data.data.encodingFileList.length
                                : data.data.encodingFileList.filter((item) => item.status.toLowerCase() === box.type)
                                      .length
                        }
                        selected={selectedStatus === index}
                        onClick={() => setSelectedStatus(index)}
                        key={`status-box-${index}`}
                    />
                ))}
            </div>
            <div className="border-grey-20 relative flex-1 overflow-auto rounded-[4px] border bg-white">
                {(!filteredData || filteredData.length === 0) && (
                    <div className="text-grey-90 flex h-full items-center justify-center">
                        업로드된 파일이 없습니다.
                    </div>
                )}
                <QueueStatusList data={filteredData} onItemClick={setSelectedItem} />
            </div>
            <QueueStatusMetadataSheet content={selectedItem} onClose={() => setSelectedItem(undefined)} />
        </div>
    );
};

export default QueueStatusPage;

const StatusSetting: StatusBoxProps[] = [
    { type: QueueStatusType[0], titleSlice: 'T', color: 'bg-[#D8E9FD] border-[#B2D4FF] text-[#4897F9]' },
    { type: QueueStatusType[1], titleSlice: 'P', color: 'bg-[#FEF7B9] border-[#FFEA70] text-[#DBA00A]' },
    { type: QueueStatusType[2], titleSlice: 'R', color: 'bg-[#C8F9FE] border-[#84EAF5] text-[#20A4BC]' },
    { type: QueueStatusType[3], titleSlice: 'S', color: 'bg-[#FFDBDB] border-[#FFC3BD] text-[#F46263]' },
    { type: QueueStatusType[4], titleSlice: 'C', color: 'bg-[#BAF8D7] border-[#91E8BA] text-[#15A271]' },
];
