import { BinIcon, Tooltip } from '@plitvice/ui';
import { useSetAtom } from 'jotai';
import { loadingState } from '@/stores';
import { MediaFile, MediaFileStatus, MediaSubFile } from '@/types/mediainfo.types.ts';
import FileDropzone from './FileDropzone.tsx';
import { formatFileSize } from '@/utils';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useMediaMetadata } from '@/hooks/useMediaInfo.ts';
import { useCallback, useMemo } from 'react';
import CommonChips from '@/components/CommonChips.tsx';
import { useFileUploadsContext } from '@/pages/encoding/FileUploadsContext.tsx';

const columnHelper = createColumnHelper<MediaFile>();

const FileUploadingList = () => {
    const { t } = useTranslation();
    const setLoading = useSetAtom(loadingState);
    const { extractMetadata } = useMediaMetadata();
    const { fileList, setFileList, removeFile } = useFileUploadsContext();

    const handleAddFile = async (mediaFileList: File[], subFileList: File[]) => {
        setLoading(true);

        const newFileList = mediaFileList.map((file) => {
            const filteredSubList = subFileList.filter((sub) => sub.name.startsWith(getFileName(file.name)));
            const validSubList: MediaSubFile[] = [];
            filteredSubList.forEach((sub) => {
                const languageCode = getLanguageCode(sub.name);
                if (languageCode) {
                    validSubList.push({
                        file: sub,
                        language: languageCode,
                    });
                }
            });

            return {
                origin: file,
                preview: URL.createObjectURL(file as Blob),
                id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`,
                progress: 0,
                status: 'pending',
                subtitles: validSubList.length > 0 ? validSubList : undefined,
            };
        }) as MediaFile[];
        const metadataResults = await extractMetadata(newFileList);
        const duplicateFilesInCurrentList: MediaFile[] = [];
        const uniqueNewFiles: MediaFile[] = [];

        newFileList.forEach((newFile) => {
            const media = metadataResults.find((media) => media.metadata?.fileName === newFile.origin.name);
            if (media?.metadata) {
                newFile.metadata = media.metadata;
            }

            const existingFileIndex = fileList.findIndex(
                (existingFile) => existingFile.origin.name === newFile.origin.name,
            );
            if (existingFileIndex !== -1) {
                duplicateFilesInCurrentList.push(newFile);
            } else {
                uniqueNewFiles.push(newFile);
            }
        });

        if (duplicateFilesInCurrentList.length > 0) {
            const duplicateNames = duplicateFilesInCurrentList.map((f) => f.origin.name).join(', ');
            const shouldOverwrite = confirm(
                `The following files are already in the dropzone:\n${duplicateNames}\n\nDo you want to overwrite them?`,
            );

            if (shouldOverwrite) {
                setFileList((prev) => {
                    const updatedList = [...prev];
                    duplicateFilesInCurrentList.forEach((newFile) => {
                        const existingIndex = updatedList.findIndex((f) => f.origin.name === newFile.origin.name);
                        if (existingIndex !== -1) {
                            if (updatedList[existingIndex].preview) {
                                URL.revokeObjectURL(updatedList[existingIndex].preview);
                            }
                            updatedList[existingIndex] = newFile;
                        }
                    });
                    return [...updatedList, ...uniqueNewFiles];
                });
            } else {
                if (uniqueNewFiles.length > 0) {
                    setFileList((prev) => {
                        return [...prev, ...uniqueNewFiles];
                    });
                }
            }
        } else {
            setFileList((prev) => [...prev, ...newFileList]);
        }
        setLoading(false);
    };

    const handleRemoveFile = useCallback(
        (file: MediaFile) => {
            const isConfirmed = confirm(t('fileUploads.section0.alertDelete', { fileName: file.origin.name }));
            if (isConfirmed) {
                removeFile(file.id);
            }
        },
        [removeFile, t],
    );

    const renderProgress = (status?: MediaFileStatus, progress = 0) => {
        let progressBar = <></>;
        let tooltipText = t('fileUploads.section0.pending');
        switch (status) {
            case 'uploading':
                tooltipText = t('fileUploads.section0.uploading');
                progressBar = (
                    <div
                        className="h-full overflow-hidden rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                );
                break;
            case 'uploaded':
                tooltipText = t('fileUploads.section0.uploaded');
                progressBar = <div className="h-full w-full rounded-full bg-green-600" />;
                break;
            case 'encoded':
                tooltipText = t('fileUploads.section0.encoded');
                progressBar = <div className="h-full w-full rounded-full bg-yellow-400" />;
                break;
            case 'error':
                tooltipText = t('fileUploads.section0.error');
                progressBar = <div className="h-full w-full rounded-full bg-red-600" />;
                break;
        }
        return (
            <Tooltip text={tooltipText} className={`w-full`}>
                <div className="bg-grey-20 relative h-[8px] w-full overflow-hidden rounded-full">
                    {progressBar}
                    {(status === 'pending' || status === 'uploading') && (
                        <div className="absolute left-0 top-0 h-full w-full -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    )}
                </div>
            </Tooltip>
        );
    };
    const columns = useMemo(() => {
        return [
            columnHelper.display({
                id: 'delete',
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => handleRemoveFile(row.original)}
                            className={`text-grey-50 flex-shrink-0 opacity-0 transition-all duration-200 hover:text-red-500 group-hover:opacity-100`}
                        >
                            <BinIcon className="h-6 w-6 transition-colors" />
                        </button>
                    </div>
                ),
                meta: { tdStyle: 'pl-[12px] text-left' },
            }),
            columnHelper.accessor('origin.name', {
                header: () => t('fileUploads.section0.tableCol0'),
                cell: ({ row }) => (
                    <div className={`flex gap-[4px]`}>
                        {row.original.subtitles ? (
                            <div className={`flex gap-[4px] pr-[8px]`}>
                                {row.original.subtitles.map(({ language }) => (
                                    <CommonChips value={language} key={`${row.original.id}-${language}`} />
                                ))}
                            </div>
                        ) : null}
                        <p className={`line-clamp-1`}>{row.original.origin.name}</p>
                    </div>
                ),
                meta: {
                    thStyle: 'text-left',
                    tdStyle: 'px-[22px] text-left',
                },
            }),
            columnHelper.accessor('metadata.duration', {
                header: () => t('fileUploads.section0.tableCol1'),
                cell: ({ getValue }) => formatDuration(getValue()),
                meta: { tdStyle: 'px-[22px]' },
            }),
            columnHelper.accessor('origin.size', {
                header: () => t('fileUploads.section0.tableCol2'),
                cell: ({ getValue }) => formatFileSize(getValue()),
                meta: { tdStyle: 'px-[22px]' },
            }),
            columnHelper.display({
                id: 'progress',
                header: t('fileUploads.section0.tableCol3'),
                cell: ({ row }) => renderProgress(row.original.status, row.original.progress),
                meta: { tdStyle: 'px-[22px]' },
            }),
        ];
    }, [handleRemoveFile, t]);

    const table = useReactTable({
        data: fileList,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <FileDropzone onAddFile={handleAddFile} />
            <div className={`border-grey-20 relative flex-1 overflow-auto rounded-[4px] border bg-white`}>
                <table className={'w-full table-fixed border-separate border-spacing-0 text-left'}>
                    <colgroup>
                        <col width="36px" />
                        <col width="100%" />
                        <col width="120px" />
                        <col width="120px" />
                        <col width="146px" />
                    </colgroup>
                    <thead className="border-grey-20 sticky top-0 z-10 border-[2px]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            className={`border-grey-20 border-b-[2px] bg-white px-[22px] text-center ${header.column.columnDef.meta?.thStyle}`}
                                            key={header.id}
                                        >
                                            <h3 className={`py-[14px]`}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </h3>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <tr
                                key={`${row.id}-${index}`}
                                className="border-grey-20 hover:bg-grey-10 group border-b text-center"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`border-grey-20 text-r16 text-grey-90 border-b py-[12px] ${cell.column.columnDef.meta?.tdStyle}`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {fileList.length === 0 && (
                    <p
                        className={`text-r16 text-grey-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-[52px]`}
                    >
                        {t('fileUploads.section0.empty')}
                    </p>
                )}
            </div>
        </>
    );
};
export default FileUploadingList;

const formatDuration = (seconds?: number): string => {
    if (!seconds || seconds <= 0) return '-';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getFileName = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
        return filename;
    }
    return filename.slice(0, lastDotIndex);
};

const getLanguageCode = (filename: string): string | null => {
    const originFileName = getFileName(filename);
    const parts = originFileName.split('_');
    if (parts.length > 1) {
        return parts.pop() || null;
    }
    return null;
};
