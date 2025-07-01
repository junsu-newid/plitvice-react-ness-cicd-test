import { Button } from '@plitvice/ui';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

interface UploadedFileItem {
    fileName: string;
    programId: string;
    presetId: number;
    languages: string | null;
    createdAt: string;
    updatedAt: string;
}

interface UploadedFilesListProps {
    data: UploadedFileItem[];
    onRunEncoding?: () => void;
}

const columnHelper = createColumnHelper<UploadedFileItem>();

// 정렬 아이콘 컴포넌트
const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => {
    if (sorted === 'asc') {
        return <span className="text-blue-600">↑</span>;
    }
    if (sorted === 'desc') {
        return <span className="text-blue-600">↓</span>;
    }
    return <span className="text-gray-300">↕</span>;
};

const columns = [
    columnHelper.accessor('fileName', {
        header: ({ column }) => (
            <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                File Name
                <SortIcon sorted={column.getIsSorted()} />
            </button>
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
    }),
    columnHelper.accessor('programId', {
        header: ({ column }) => (
            <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Program ID
                <SortIcon sorted={column.getIsSorted()} />
            </button>
        ),
        cell: (info) => (
            <div className="max-w-[200px] truncate" title={info.getValue()}>
                {info.getValue()}
            </div>
        ),
        enableSorting: true,
    }),
    columnHelper.accessor('presetId', {
        header: ({ column }) => (
            <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Preset ID
                <SortIcon sorted={column.getIsSorted()} />
            </button>
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
    }),
    columnHelper.accessor('languages', {
        header: ({ column }) => (
            <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Languages
                <SortIcon sorted={column.getIsSorted()} />
            </button>
        ),
        cell: (info) => info.getValue() || '-',
        enableSorting: true,
    }),
    columnHelper.accessor('createdAt', {
        header: ({ column }) => (
            <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Created At
                <SortIcon sorted={column.getIsSorted()} />
            </button>
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
    }),
    columnHelper.accessor('updatedAt', {
        header: ({ column }) => (
            <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Updated At
                <SortIcon sorted={column.getIsSorted()} />
            </button>
        ),
        cell: (info) => info.getValue(),
        enableSorting: true,
    }),
];

const UploadedFilesList = ({ data, onRunEncoding }: UploadedFilesListProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="flex flex-col gap-3">
            <div className="text-md font-bold leading-5">Uploaded Files</div>
            <div className="flex flex-col gap-3 bg-white p-4">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-gray-200">
                                    <th className="w-8 p-3 text-left text-sm font-medium text-gray-500">#</th>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="p-3 text-left text-sm font-medium text-gray-500">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row, index) => (
                                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-900">{index + 1}</td>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3 text-sm text-gray-900">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(!data || data.length === 0) && (
                        <div className="flex h-32 items-center justify-center text-gray-500">
                            업로드된 파일이 없습니다.
                        </div>
                    )}
                </div>
                <div className="flex h-[38px] w-full justify-end">
                    <Button
                        variant="normal"
                        size="medium"
                        disabled={!data || data.length === 0}
                        onClick={onRunEncoding}
                    >
                        Run Encoding
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UploadedFilesList;
