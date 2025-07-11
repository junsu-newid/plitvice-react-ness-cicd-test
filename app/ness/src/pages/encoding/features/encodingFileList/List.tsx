import {
    Column,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EncodingFileItem } from '@/api/models/fileList.ts';
import { StatusChip, TagChip, TooltipBox } from '@plitvice/ui';
import { StatusColor } from '@plitvice/ui/components/chips/StatusChip.tsx';
import { EncodingListType } from '@/types/enum.ts';
import SortHeader from '@/components/SortHeader.tsx';
import { TooltipBoxOnOverflow } from '@plitvice/ui/components/textfield/TooltipBoxOnOverflow.tsx';

interface Props {
    data: EncodingFileItem[];
}
const columnHelper = createColumnHelper<EncodingFileItem>();

function EncodingFileList({ data }: Props) {
    const { t } = useTranslation();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'status', desc: false }]);

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '-';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const pad2 = (num: number) => String(num).padStart(2, '0');

        return `${hours}:${pad2(minutes)}:${pad2(secs)}`;
    };

    const formatProcTime = (seconds: number | null) => {
        if (!seconds) return '-';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m ${secs}s`;
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('type', {
                header: ({ column }) => <SortHeader title={t('fileList.tableCol0')} column={column} />,
                cell: (info) => <TagChip>{info.getValue() || '-'}</TagChip>,
                enableSorting: true,
            }),
            columnHelper.accessor('status', {
                header: ({ column }) => <SortHeader title={t('fileList.tableCol1')} column={column} />,
                cell: (info) => {
                    let chipColor: StatusColor = 'green';
                    switch (info.getValue()) {
                        case EncodingListType[1]:
                            chipColor = 'yellow';
                            break;
                        case EncodingListType[2]:
                            chipColor = 'cyan';
                            break;
                        case EncodingListType[3]:
                            chipColor = 'red';
                            break;
                    }
                    return (
                        <StatusChip color={chipColor}>
                            ● {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1) || '-'}
                        </StatusChip>
                    );
                },
                enableSorting: true,
            }),
            columnHelper.accessor('totalTimeSpent', {
                header: () => (
                    <TooltipBox
                        className="flex items-center gap-1"
                        displayText={t('fileList.tableCol8')}
                        tooltipText={'Encoding Process Time'}
                    />
                ),
                cell: (info) => <p className={`text-center`}>{formatProcTime(info.getValue())}</p>,
                enableSorting: true,
            }),
            columnHelper.accessor('programTitle', {
                header: ({ column }) => (
                    <SortHeader title={t('fileList.tableCol3')} column={column as Column<EncodingFileItem, string>} />
                ),
                cell: (info) => (
                    <TooltipBoxOnOverflow
                        className={'line-clamp-2 break-all'}
                        displayText={info.getValue() || '-'}
                        tooltipText={info.getValue() || '-'}
                    />
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('programId', {
                header: ({ column }) => <SortHeader title={t('fileList.tableCol4')} column={column} />,
                cell: (info) => (
                    <TooltipBoxOnOverflow
                        className={'line-clamp-2 break-all'}
                        displayText={info.getValue() || '-'}
                        tooltipText={info.getValue() || '-'}
                    />
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('duration', {
                header: () => <p className="flex items-center gap-1">{t('fileList.tableCol5')}</p>,
                cell: (info) => <p className={`text-center`}>{formatDuration(info.getValue()) || '-'}</p>,
                enableSorting: true,
            }),
            columnHelper.accessor('notes', {
                header: () => <p className="flex items-center gap-1">{t('fileList.tableCol9')}</p>,
                cell: (info) => (
                    <TooltipBoxOnOverflow
                        className={'line-clamp-2 break-all'}
                        displayText={info.getValue() || '-'}
                        tooltipText={info.getValue() || '-'}
                    />
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('startedAt', {
                header: ({ column }) => <SortHeader title={t('fileList.tableCol6')} column={column} />,
                cell: (info) => <p>{info.getValue() || '-'}</p>,
                enableSorting: true,
            }),
            columnHelper.accessor('finishedAt', {
                header: ({ column }) => (
                    <SortHeader title={t('fileList.tableCol7')} column={column as Column<EncodingFileItem, string>} />
                ),
                cell: (info) => <p>{info.getValue() || '-'}</p>,
                enableSorting: true,
            }),
        ],
        [t],
    );
    const table = useReactTable({
        data: data || [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <table className={'absolute left-0 top-0 w-full table-fixed border-separate border-spacing-0 text-left'}>
            <colgroup>
                <col width="96px" />
                <col width="134px" />
                <col width="120px" />
                <col style={{ minWidth: '400px', width: '60%' }} />
                <col style={{ minWidth: '400px', width: '60%' }} />
                <col width="111px" />
                <col width="324px" />
                <col width="156px" />
                <col width="156px" />
            </colgroup>
            <thead className={'text-m16 text-grey-70 sticky top-0 z-20'}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className={`border-grey-10 border-b`}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className={`border-grey-20 border-b-[2px] bg-white px-[22px]`}>
                                <h3 className={`leading-[50px]`}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </h3>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-grey-20 hover:bg-grey-10 border-b">
                        {row.getVisibleCells().map((cell) => {
                            return (
                                <td
                                    key={cell.id}
                                    className={`border-grey-20 text-r14 text-grey-90 border-b px-[22px] py-[14px]`}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
export default EncodingFileList;
