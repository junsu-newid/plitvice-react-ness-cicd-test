import { Button } from '@plitvice/ui';
import { useState, useEffect } from 'react';
import FileDropzone, { MediaFile } from './components/FileDropzone';
import FileList from './components/FileList';
import UploadedFilesList from './components/UploadedFilesList';
import { useMultipartUpload } from '@/hooks/useMultipartUpload';
import { getUploadedFiles, UploadedFileItem, validateFiles } from '@/services/fileUpload';
import { useMediaMetadata } from '@/hooks/useMediaInfo';
import { useUser } from '@/hooks/useUser';

const FileUpload = () => {
    const { userId } = useUser();
    const [data, setData] = useState<UploadedFileItem[]>([]);
    const [fileList, setFileList] = useState<MediaFile[]>([]);

    const { uploadFiles, cancelUpload, isUploading } = useMultipartUpload();
    const { extractMetadata } = useMediaMetadata();

    // userId를 사용해서 업로드된 파일 목록 가져오기
    useEffect(() => {
        const fetchUploadedFiles = async () => {
            try {
                const response = await getUploadedFiles(userId);
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch uploaded files:', error);
            }
        };

        fetchUploadedFiles();
    }, [userId]);

    // Files and folders 영역 파일 추가 핸들러
    const handleFilesAdded = async (newFiles: MediaFile[]) => {
        try {
            // 1. 서버에 중복 파일이 있는지 체크
            const fileNameList = newFiles.map((file) => ({ fileName: file.name }));
            const validationResponse = await validateFiles(fileNameList, userId);
            console.log('**************************************************');
            console.log('validationResponse:', validationResponse);

            // 2. 서버에 중복이 없는 파일들만 현재 첨부된 파일 목록과 중복 체크
            const duplicateFilesInCurrentList: MediaFile[] = [];
            const uniqueNewFiles: MediaFile[] = [];

            newFiles.forEach((newFile) => {
                const existingFileIndex = fileList.findIndex((existingFile) => existingFile.name === newFile.name);

                if (existingFileIndex !== -1) {
                    duplicateFilesInCurrentList.push(newFile);
                } else {
                    uniqueNewFiles.push(newFile);
                }
            });

            // 3. 현재 첨부 목록에 중복이 있으면 덮어쓰기 확인
            if (duplicateFilesInCurrentList.length > 0) {
                const duplicateNames = duplicateFilesInCurrentList.map((f) => f.name).join(', ');
                const shouldOverwrite = confirm(
                    `The following files are already in the dropzone:\n${duplicateNames}\n\nDo you want to overwrite them?`,
                );

                if (shouldOverwrite) {
                    // 기존 파일 제거하고 새 파일로 교체
                    setFileList((prev) => {
                        const updatedList = [...prev];
                        duplicateFilesInCurrentList.forEach((newFile) => {
                            const existingIndex = updatedList.findIndex((f) => f.name === newFile.name);
                            if (existingIndex !== -1) {
                                // 기존 preview URL 정리
                                if (updatedList[existingIndex].preview) {
                                    URL.revokeObjectURL(updatedList[existingIndex].preview);
                                }
                                updatedList[existingIndex] = newFile;
                            }
                        });
                        return [...updatedList, ...uniqueNewFiles];
                    });
                } else {
                    // 중복 파일은 추가하지 않고 새로운 파일만 추가
                    if (uniqueNewFiles.length > 0) {
                        setFileList((prev) => [...prev, ...uniqueNewFiles]);
                    }
                }
            } else {
                // 4. 중복이 없으면 모든 파일 추가
                setFileList((prev) => [...prev, ...newFiles]);
            }
        } catch {
            // 중복파일체크를 하는 것은 정상적인 비즈니스 로직인데 400 상태코드를 반환하는 게 잘못된 API 설계.
            // 올바른 설계:
            // 200 OK + { data: false } → 중복 파일 있음
            // 200 OK + { data: true } → 중복 파일 없음
            // 400 Bad Request → 요청 파라미터가 잘못됨 (필수값 누락 등)
            // 지금은 그냥 중복파일있으면 상태코드 400리턴해버림.
            alert('중복 파일이 서버에 존재합니다.');
        }
    };

    // Files and folders 영역 파일 제거 핸들러
    const handleRemoveFile = (fileId: string) => {
        setFileList((prev) => {
            const fileToRemove = prev.find((file) => file.id === fileId);
            if (fileToRemove && fileToRemove.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter((file) => file.id !== fileId);
        });
    };

    // 업로드 시작 핸들러
    const handleStartUpload = async () => {
        if (fileList.length === 0) {
            alert('No files to upload.');
            return;
        }

        try {
            // MediaFile[]을 FileWithMetadata[]로 변환
            const filesWithMetadata = await Promise.all(
                fileList.map(async (mediaFile) => {
                    // 메타데이터 추출
                    const metadataResults = await extractMetadata([mediaFile]);
                    const metadataResult = metadataResults[0];

                    if (!metadataResult.metadata) {
                        throw new Error(`메타데이터 추출 실패: ${mediaFile.name}`);
                    }

                    return {
                        file: mediaFile,
                        metadata: metadataResult.metadata,
                        subtitles: undefined, // 필요시 자막 파일 추가
                    };
                }),
            );

            await uploadFiles(filesWithMetadata, userId);
            alert('All files have been uploaded successfully!');
            setFileList([]); // 업로드 완료 후 파일 목록 초기화

            // 업로드된 파일 목록 새로고침
            const response = await getUploadedFiles(userId);
            setData(response.data);
        } catch (error) {
            alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        }
    };

    // 업로드 취소 핸들러
    const handleCancelUpload = () => {
        cancelUpload();
        alert('Upload has been cancelled.');
    };

    // 인코딩 실행 핸들러
    const handleRunEncoding = () => {
        // TODO: 인코딩 실행 로직 구현
        console.log('Start encoding');
    };

    return (
        <div className="relative flex min-w-[1000px] flex-col pb-9 pt-12">
            <div>
                <div className="text-[28px] font-bold leading-9">File Upload</div>
                <div className="text-grey-60 pb-6 pt-4 text-sm">
                    <div>인코딩할 파일을 업로드하고, 인코딩을 시작할 수 있는 페이지입니다.</div>
                    <div>인코딩이 사작되면, 진행 상황은 Encoding File List에서 확인하실 수 있습니다.</div>
                </div>
            </div>
            <div className="flex flex-col gap-3 bg-white p-4">
                <FileDropzone onFilesAdded={handleFilesAdded} disabled={isUploading} />
                <FileList files={fileList} onRemoveFile={handleRemoveFile} isUploading={isUploading} />
                <div className="flex h-[38px] w-full justify-end">
                    {isUploading ? (
                        <Button size="medium" variant="default" onClick={handleCancelUpload}>
                            Cancel Upload
                        </Button>
                    ) : (
                        <Button size="medium" disabled={fileList.length === 0} onClick={handleStartUpload}>
                            Upload Files
                        </Button>
                    )}
                </div>
            </div>
            <UploadedFilesList data={data} onRunEncoding={handleRunEncoding} />
        </div>
    );
};

export default FileUpload;
