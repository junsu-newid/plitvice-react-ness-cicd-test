import { BinIcon } from '@plitvice/ui';
import { MediaFile } from './FileDropzone.tsx';
import { formatFileSize } from '@/utils';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';

interface FileListProps {
    files: MediaFile[];
    onRemoveFile: (id: string) => void;
    isUploading?: boolean;
    onFilesReorder?: (reorderedFiles: MediaFile[]) => void;
}

const columnHelper = createColumnHelper<MediaFile>();

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

// Duration을 HH:MM:SS 포맷으로 변환하는 함수
const formatDuration = (seconds?: number): string => {
    if (!seconds || seconds <= 0) return '-';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const FileList = ({ files, onRemoveFile, isUploading = false, onFilesReorder }: FileListProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleRemoveFile = (file: MediaFile) => {
        const isConfirmed = confirm(`"${file.name}" 파일을 삭제하시겠습니까?`);
        if (isConfirmed) {
            onRemoveFile(file.id);
        }
    };

    const columns = [
        // 삭제 버튼 컬럼
        columnHelper.display({
            id: 'delete',
            header: '',
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => handleRemoveFile(row.original)}
                        disabled={isUploading}
                        className={`flex-shrink-0 rounded-sm p-1 opacity-0 transition-all duration-200 group-hover:opacity-100 ${
                            isUploading ? 'cursor-not-allowed text-gray-300' : 'text-gray-500 hover:text-red-500'
                        }`}
                    >
                        <BinIcon className="h-6 w-6 transition-colors" />
                    </button>
                </div>
            ),
            size: 60,
        }),
        // Name 컬럼
        columnHelper.accessor('name', {
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => {
                        console.log('Name 컬럼 클릭, 현재 정렬 상태:', column.getIsSorted());
                        column.toggleSorting(column.getIsSorted() === 'asc');
                    }}
                >
                    Name
                    <SortIcon sorted={column.getIsSorted()} />
                </button>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span
                        className="max-w-[300px] truncate"
                        title={row.original.name}
                        style={{
                            fontFamily: 'Pretendard',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '18px',
                        }}
                    >
                        {row.original.name}
                    </span>

                    {/* 업로드 진행 상태 표시 */}
                    {row.original.progress !== undefined &&
                        row.original.progress > 0 &&
                        !row.original.uploaded &&
                        !row.original.error && (
                            <div className="mt-1 h-1 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-1 rounded-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${row.original.progress}%` }}
                                />
                            </div>
                        )}

                    {/* 업로드 상태 메시지 */}
                    {row.original.uploaded && <span className="mt-1 text-xs text-green-500">업로드 완료</span>}
                    {row.original.error && <span className="mt-1 text-xs text-red-500">{row.original.error}</span>}
                </div>
            ),
            enableSorting: true,
        }),
        // Duration 컬럼
        columnHelper.accessor('duration', {
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => {
                        console.log('Duration 컬럼 클릭, 현재 정렬 상태:', column.getIsSorted());
                        column.toggleSorting(column.getIsSorted() === 'asc');
                    }}
                >
                    Duration
                    <SortIcon sorted={column.getIsSorted()} />
                </button>
            ),
            cell: ({ getValue }) => <span className="text-sm">{formatDuration(getValue())}</span>,
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
                const a = rowA.original.duration || 0;
                const b = rowB.original.duration || 0;
                return a - b;
            },
            size: 120,
        }),
        // Size 컬럼
        columnHelper.accessor('size', {
            header: ({ column }) => (
                <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => {
                        console.log('Size 컬럼 클릭, 현재 정렬 상태:', column.getIsSorted());
                        column.toggleSorting(column.getIsSorted() === 'asc');
                    }}
                >
                    Size
                    <SortIcon sorted={column.getIsSorted()} />
                </button>
            ),
            cell: ({ getValue }) => <span className="text-sm">{formatFileSize(getValue())}</span>,
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
                const a = rowA.original.size;
                const b = rowB.original.size;
                return a - b;
            },
            size: 100,
        }),
    ];

    const table = useReactTable({
        data: files,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    // 정렬이 변경될 때마다 정렬된 파일 순서를 상위 컴포넌트에 전달
    useEffect(() => {
        console.log('정렬 상태 변경:', sorting);
        if (onFilesReorder && sorting.length > 0) {
            const sortedFiles = table.getSortedRowModel().rows.map((row) => row.original);
            console.log(
                '정렬된 파일 순서:',
                sortedFiles.map((f) => f.name),
            );
            onFilesReorder(sortedFiles);
        }
    }, [sorting, onFilesReorder, table]);

    if (files.length === 0) {
        return (
            <div className="flex h-[288px] w-full items-center justify-center rounded-sm border border-[#D8D8DA]">
                <div className="text-gray-500">업로드할 파일이 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="h-[288px] w-full overflow-hidden rounded-sm border border-[#D8D8DA]">
            <div className="h-full overflow-auto">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 border-b border-gray-200 bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className={`px-6 py-3 text-sm font-medium text-gray-500 ${
                                            header.column.id === 'duration' || header.column.id === 'size'
                                                ? 'text-right'
                                                : 'text-left'
                                        }`}
                                        style={{
                                            width: header.getSize() !== 150 ? header.getSize() : undefined,
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="group border-b border-gray-100 transition-colors hover:bg-gray-50"
                                style={{ height: '48px' }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 text-sm text-gray-900">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FileList;
