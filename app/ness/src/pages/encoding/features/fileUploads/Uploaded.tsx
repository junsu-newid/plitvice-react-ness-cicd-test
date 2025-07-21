import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import SortHeader from '@/components/SortHeader.tsx';
import { useTranslation } from 'react-i18next';
import { UploadedFileItem } from '@/api/models/fileUploads.ts';
import { StatusChip } from '@plitvice/ui/components/chips/StatusChip.tsx';
import { Button, ErrorIcon, SelectBox, Tooltip, useToast } from '@plitvice/ui';
import { differenceInCalendarDays, parse, startOfToday } from 'date-fns';
import useFileUploaded from '@/pages/encoding/features/fileUploads/Uploaded.hooks.ts';
import CommonChips from '@/components/CommonChips.tsx';
import { useUserId } from '@/hooks/useUser.ts';
import { MoreVertIcon } from '@plitvice/ui';
import { DropdownList, SelectOption } from '@plitvice/ui/components/selectbox/DropdownList.tsx';

const columnHelper = createColumnHelper<UploadedFileItem>();
const today = startOfToday();
const date = new Date();

const FileUploadedList = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const userId = useUserId();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'uploadedAt', desc: false }]);
    const [isOpenPresetAll, setIsOpenPresetAll] = useState(false);
    const { uploadedList, presetOptionList, changePreset, changePresetAll, runEncoding } = useFileUploaded({ userId });

    const availableEncoding = useCallback(() => {
        if (uploadedList.length > 0 && presetOptionList.length > 0) {
            const presetIdList = new Set(presetOptionList.map((preset) => preset.value));
            return uploadedList.some((uploaded) => !presetIdList.has(uploaded.presetId));
        } else {
            return true;
        }
    }, [uploadedList, presetOptionList]);

    const handleChangePresetAll = useCallback(
        (option: SelectOption) => {
            changePresetAll(option.value as number);
            setIsOpenPresetAll(false);
        },
        [changePresetAll],
    );

    const handleRunEncoding = useCallback(
        (data: UploadedFileItem[]) => {
            runEncoding(data).then((result) => {
                if (result) {
                    showToast(t('fileUploads.section1.infoSuccess'), 'info');
                } else {
                    showToast(t('fileUploads.section1.errorQueued'), 'error');
                }
            });
        },
        [runEncoding, showToast, t],
    );

    const columns = useMemo(
        () => [
            columnHelper.accessor('presetId', {
                id: 'presetStatus',
                header: t('fileUploads.section1.tableCol0'),
                cell: (info) => {
                    const foundItem = presetOptionList.find((item) => item.value === info.getValue());
                    return foundItem ? (
                        <StatusChip color={'blue'}>{t('fileUploads.section1.ready')}</StatusChip>
                    ) : (
                        <StatusChip color={'red'}>{t('fileUploads.section1.error')}</StatusChip>
                    );
                },
            }),
            columnHelper.accessor('presetId', {
                id: 'presetSelector',
                header: () => (
                    <div className={`relative flex items-center justify-between pr-[8px]`}>
                        <p>{t('fileUploads.section1.tableCol1')}</p>
                        <Tooltip className={`h-[24px]`} text={t('fileUploads.section1.tooltipPreset')}>
                            <button
                                className={`rounded-full ${isOpenPresetAll ? 'bg-blue-100 text-blue-600' : 'text-grey-50'} hover:text-blue-600`}
                                onClick={() => setIsOpenPresetAll(!isOpenPresetAll)}
                            >
                                <MoreVertIcon />
                            </button>
                        </Tooltip>
                        <DropdownList
                            size={'medium'}
                            isFocused={isOpenPresetAll}
                            optionList={presetOptionList}
                            onSelected={handleChangePresetAll}
                        />
                    </div>
                ),
                cell: (info) => {
                    const origin = info.row.original;
                    const findIndex = presetOptionList.findIndex((item) => item.value === origin.presetId);
                    if (presetOptionList.length > 0 && findIndex > -1) {
                        return (
                            <div className={`pb-[5px] pt-[1px]`}>
                                <SelectBox
                                    size={'medium'}
                                    border={false}
                                    optionList={presetOptionList}
                                    value={origin.presetId}
                                    onChange={(value: number) => changePreset(origin.programId, value)}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <div className={`flex items-center justify-between pr-[8px] text-red-600`}>
                                <p className={`text-r16 pl-[12px]`}>{t('fileUploads.section1.errorDesc')}</p>
                                <ErrorIcon />
                            </div>
                        );
                    }
                },
                meta: { tdStyle: 'pl-[12px]' },
            }),
            columnHelper.accessor('fileName', {
                header: ({ column }) => <SortHeader title={t('fileUploads.section1.tableCol2')} column={column} />,
                cell: (info) => (
                    <div className={`flex gap-[4px]`}>
                        {info.row.original.languages ? (
                            <div className={`flex gap-[4px] pr-[8px]`}>
                                {info.row.original.languages.split(',').map((lang) => (
                                    <CommonChips value={lang} key={`${info.row.original.programId}-${lang}`} />
                                ))}
                            </div>
                        ) : null}
                        <a
                            className={`line-clamp-1 hover:text-blue-600 hover:underline`}
                            target={'_blank'}
                            href={`https://partner.its-newid.net/?cmd=edit&id=${info.row.original.programId}`}
                        >
                            {info.getValue()}
                        </a>
                    </div>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('createdAt', {
                id: 'uploadedAt',
                header: ({ column }) => <SortHeader title={t('fileUploads.section1.tableCol3')} column={column} />,
                cell: (info) => info.getValue().split(' ')[0],
                enableSorting: true,
            }),
            columnHelper.accessor('createdAt', {
                id: 'destroyAt',
                header: () => t('fileUploads.section1.tableCol4'),
                cell: (info) => {
                    const createdAt = parse(info.getValue(), 'yyyy-MM-dd HH:mm:ss', date);
                    const dayDiff = differenceInCalendarDays(today, createdAt) - 7;
                    return <p className={`text-red-600`}>{dayDiff > 0 ? 'D-Day' : `D-${Math.abs(dayDiff)}`}</p>;
                },
            }),
        ],
        [changePreset, handleChangePresetAll, isOpenPresetAll, presetOptionList, t],
    );

    const table = useReactTable({
        data: uploadedList || [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <div className={`border-grey-20 relative flex-1 overflow-auto rounded-[4px] border bg-white`}>
                <table className={'w-full table-fixed border-separate border-spacing-0 text-left'}>
                    <colgroup>
                        <col width="80px" />
                        <col width="120px" />
                        <col width="200px" />
                        <col width="100%" />
                        <col width="164px" />
                        <col width="94px" />
                    </colgroup>
                    <thead className={'text-b16 text-grey-70 sticky top-0 z-20'}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                <th className={`border-grey-20 border-b-[2px] bg-white px-[22px] text-center`}>
                                    <h3 className={'py-[15px]'}>#</h3>
                                </th>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        className={`border-grey-20 border-b-[2px] bg-white px-[22px] ${header.column.columnDef.meta?.thStyle}`}
                                        key={header.id}
                                    >
                                        <h3 className={'py-[12px]'}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </h3>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <tr key={`${row.id}-${index}`} className="border-grey-20 hover:bg-grey-10 border-b">
                                <td className={`border-grey-20 text-r16 text-grey-90 border-b px-[22px] text-center`}>
                                    <p>{index + 1}</p>
                                </td>
                                {row.getVisibleCells().map((cell, index) => (
                                    <td
                                        key={`${cell.id}-${index}`}
                                        className={`border-grey-20 text-r16 text-grey-90 border-b px-[22px] ${cell.column.columnDef.meta?.tdStyle}`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {uploadedList.length === 0 && (
                    <p
                        className={`text-r16 text-grey-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-[52px]`}
                    >
                        {t('fileUploads.section1.empty')}
                    </p>
                )}
            </div>
            <Button
                variant="normal"
                size="medium"
                disabled={availableEncoding()}
                onClick={() => handleRunEncoding(uploadedList)}
            >
                {t('fileUploads.section1.btn')}
            </Button>
        </>
    );
};
export default FileUploadedList;
