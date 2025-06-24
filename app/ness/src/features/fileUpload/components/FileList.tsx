import { X } from 'lucide-react';
import { MediaFile } from './FileDropzone';
import { formatFileSize } from '@/utils';

interface FileListProps {
    files: MediaFile[];
    onRemoveFile: (id: string) => void;
    isUploading?: boolean;
}

const FileList = ({ files, onRemoveFile, isUploading = false }: FileListProps) => {
    if (files.length === 0) {
        return (
            <div className="flex h-[288px] w-full items-center justify-center rounded-sm border border-[#D8D8DA]">
                <div className="text-gray-500">업로드할 파일이 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="h-[288px] w-full overflow-y-auto rounded-sm border border-[#D8D8DA] p-4">
            <div className="space-y-2">
                {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between rounded-md border bg-gray-50 p-3">
                        <div className="mr-4 flex flex-1 items-center">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                    {file.type} • {formatFileSize(file.size)}
                                </p>

                                {/* 업로드 진행 상태 표시 */}
                                {file.progress !== undefined && file.progress > 0 && !file.uploaded && !file.error && (
                                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
                                            style={{ width: `${file.progress}%` }}
                                        />
                                    </div>
                                )}

                                {/* 업로드 상태 메시지 */}
                                {file.uploaded && <p className="mt-1 text-xs text-green-500">업로드 완료</p>}

                                {file.error && <p className="mt-1 text-xs text-red-500">{file.error}</p>}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemoveFile(file.id)}
                            disabled={isUploading}
                            className={`p-1 ${
                                isUploading ? 'cursor-not-allowed text-gray-300' : 'text-gray-500 hover:text-red-500'
                            } flex-shrink-0 transition`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
