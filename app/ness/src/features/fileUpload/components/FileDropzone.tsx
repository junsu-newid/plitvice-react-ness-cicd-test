import { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@plitvice/ui';

// 허용된 파일 확장자 목록
const WHITELIST_FILE_EXTENSIONS = {
    'video/mp4': ['.mp4'],
    'video/quicktime': ['.mov'],
    'video/mpeg': ['.mpeg', '.mpg'],
};

// 확장자를 MIME 타입으로 변환하는 매핑
// const EXTENSION_TO_MIME_TYPE: { [key: string]: string } = {
//     '.mp4': 'video/mp4',
//     '.mov': 'video/quicktime',
//     '.mpeg': 'video/mpeg',
//     '.mpg': 'video/mpeg',
// };

export interface MediaFile extends File {
    preview: string;
    id: string;
    progress?: number;
    uploaded?: boolean;
    error?: string;
}

interface FileWithPath {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    path?: string;
    webkitRelativePath?: string;
}

interface FileDropzoneProps {
    onFilesAdded: (files: MediaFile[]) => void;
    disabled?: boolean;
}

const FileDropzone = ({ onFilesAdded, disabled = false }: FileDropzoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    // 폴더 안에 폴더가 있는지 확인하는 함수
    const isNestedFolder = (files: FileWithPath[]): boolean => {
        return files.some((file) => {
            const filePath = file.path || file.webkitRelativePath || '';
            // \ 를 / 로 변환 이후 split 해서 2개를 초과하는 경우 중첩폴더로 판단
            const splitPathCnt = filePath.replace(/\\/g, '/').split('/').length;
            return splitPathCnt > 2;
        });
    };

    // const extractMimeType = (fileName: string) => {
    //     const extension = fileName.toLowerCase().match(/\.[0-9a-z]+$/);
    //     if (!extension) return null;
    //     return EXTENSION_TO_MIME_TYPE[extension[0]] || null;
    // };

    const isValidMediaFile = (filename: string): boolean => {
        const extension = filename.toLowerCase().match(/\.[0-9a-z]+$/);
        if (!extension) return false;
        return Object.values(WHITELIST_FILE_EXTENSIONS).some((types) => types.includes(extension[0]));
    };

    const processFileList = (acceptedFiles: FileWithPath[] | File[]) => {
        if (acceptedFiles.length === 0) return;

        const validFiles = acceptedFiles.filter((file) => isValidMediaFile(file.name));

        if (validFiles.length === 0) {
            alert('지원되지 않는 파일 형식입니다. MP4, MOV, MPEG, MPG 파일만 업로드 가능합니다.');
            return;
        }

        const newFileList = validFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file as Blob),
                id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`,
                progress: 0,
                uploaded: false,
            }),
        ) as MediaFile[];

        onFilesAdded(newFileList);
    };

    // 파일 첨부 선택
    const handleFileSelect = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (fileInputRef.current && !disabled) {
            fileInputRef.current.click();
        }
    };

    // 파일 첨부 선택
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            console.log(
                '파일 선택됨:',
                selectedFiles.map((f) => f.name),
            );
            processFileList(selectedFiles);

            // 입력 요소 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // 폴더 첨부 선택
    const handleFolderSelect = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (folderInputRef.current && !disabled) {
            folderInputRef.current.click();
        }
    };

    // 폴더 선택 변경 핸들러
    const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFileList = Array.from(event.target.files) as FileWithPath[];

            // 중첩 폴더 체크
            if (isNestedFolder(selectedFileList)) {
                alert('다중 폴더는 첨부가 불가능합니다.');
                if (folderInputRef.current) {
                    folderInputRef.current.value = '';
                }
                return;
            }

            // 루트 폴더 이름 (첫 번째 파일의 경로에서 추출)
            const rootFolderName =
                selectedFileList.length > 0 ? (selectedFileList[0].webkitRelativePath || '').split('/')[0] : '';

            // 루트 폴더 바로 아래 파일만 필터링
            const folderFiles = selectedFileList.filter((file) => {
                const path = file.webkitRelativePath || '';
                const pathParts = path.split('/');

                // 정확히 "루트폴더명/파일명" 패턴인지 확인 (경로 깊이가 2인지)
                const isDirectChild = pathParts.length === 2 && pathParts[0] === rootFolderName;

                // 지원되는 파일 형식인지 확인
                const isSupportedType = isValidMediaFile(file.name);

                return isDirectChild && isSupportedType;
            });

            console.log(
                '필터링된 파일:',
                folderFiles.map((f) => ({
                    name: f.name,
                    path: f.webkitRelativePath,
                    type: f.type,
                })),
            );

            processFileList(folderFiles as File[]);

            // 입력 요소 초기화
            if (folderInputRef.current) {
                folderInputRef.current.value = '';
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: WHITELIST_FILE_EXTENSIONS,
        onDrop: processFileList,
        noClick: true, // 클릭으로 파일 선택 비활성화 (dropzone 안의 Add File, Add Folder 버튼을 통해서만 파일 첨부 가능)
        disabled,
    });

    return (
        <div className="flex flex-col gap-3">
            <div className="text-md font-bold leading-5">Files and folders</div>
            <div className="flex flex-col gap-3 bg-white p-4">
                <div
                    {...getRootProps()}
                    className={`h-21 flex w-full items-center justify-center rounded-sm border border-dashed ${
                        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-[#8E8E90]'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                    <input {...getInputProps()} />

                    {/* Add File 버튼 클릭 시 파일 선택 입력 요소 */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".mp4,.mov,.mpeg,.mpg"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* Add Folder 버튼 클릭 시 폴더 선택 입력 요소 */}
                    <input
                        ref={folderInputRef}
                        type="file"
                        // @ts-expect-error - webkitdirectory is not in the standard HTMLInputElement type definition
                        webkitdirectory="true"
                        directory="true"
                        mozdirectory="true"
                        multiple
                        className="hidden"
                        onChange={handleFolderChange}
                    />

                    <div className="flex items-center">
                        {isDragActive ? (
                            <span>Drop files here to upload</span>
                        ) : (
                            <>
                                Drag and drop files or folders here to upload, or click &nbsp;
                                <Button onClick={handleFileSelect} size="medium" disabled={disabled}>
                                    Add File
                                </Button>
                                &nbsp;or &nbsp;
                                <Button onClick={handleFolderSelect} size="medium" disabled={disabled}>
                                    Add Folder
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileDropzone;
