import { useCallback, useEffect, useState } from 'react';
import { notifyUploadCompletion, requestPresignedFile, validateFile } from '@/api/services/fileUploads.ts';
import {
    PartUploadResult,
    splitFileIntoChunks,
    uploadChunk,
    uploadSubtitleFile,
} from '@/pages/encoding/features/fileUploads/Uploading.utils.ts';
import { MediaFile, MediaFileStatus } from '@/types/mediainfo.types.ts';
import { useUserId } from '@/hooks/useUser.ts';

function useFileUploads() {
    const userId = useUserId();
    const [isUploading, setIsUploading] = useState(false);
    const [fileList, setFileList] = useState<MediaFile[]>([]);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const removeFile = useCallback(
        (fileId: string) => {
            setFileList((prev) => {
                const fileToRemove = prev.find((file) => file.id === fileId);
                if (fileToRemove && fileToRemove.preview) {
                    if (fileToRemove.status === 'uploading') {
                        abortController?.abort();
                    }
                    URL.revokeObjectURL(fileToRemove.preview);
                }
                return prev.filter((file) => file.id !== fileId);
            });
        },
        [abortController],
    );

    const uploadSingleFile = useCallback(
        async (
            file: MediaFile,
            onProgress: (progress: number) => void,
            onStatus: (status: MediaFileStatus) => void,
        ) => {
            const controller = new AbortController();
            setAbortController(controller);
            try {
                if (controller.signal.aborted) {
                    throw new Error('업로드가 취소되었습니다.');
                }

                const validate = await validateFile(file.origin.name, userId);
                if (validate) {
                    onStatus('uploaded');
                    return;
                }

                const presignedResponse = await requestPresignedFile(file, userId);
                const videoFileInfo = presignedResponse.data;

                if (file.subtitles && file.subtitles.length > 0 && videoFileInfo.subtitles) {
                    for (const subtitle of file.subtitles) {
                        if (controller.signal.aborted) {
                            throw new Error('업로드가 취소되었습니다.');
                        }

                        const subtitlePresignedUrl = videoFileInfo.subtitles.find(
                            (s) => s.language === subtitle.language,
                        )?.presignedUrl;

                        if (subtitlePresignedUrl) {
                            await uploadSubtitleFile(subtitle.file, subtitlePresignedUrl, controller.signal);
                        } else {
                            console.warn(`자막 파일 ${subtitle.file.name}에 대한 presigned URL을 찾을 수 없습니다.`);
                        }
                    }
                }

                const chunks = splitFileIntoChunks(file.origin);
                const totalParts = chunks.length;
                const uploadResults: PartUploadResult[] = [];
                for (let i = 0; i < chunks.length; i++) {
                    if (controller.signal.aborted) {
                        throw new Error('업로드가 취소되었습니다.');
                    }

                    const chunk = chunks[i];
                    const partNumber = i + 1;
                    const presignedUrl = videoFileInfo.preSignedUrls[i];

                    const result = await uploadChunk(
                        presignedUrl,
                        chunk,
                        file.origin.type,
                        partNumber,
                        controller.signal,
                    );
                    uploadResults.push(result);

                    const completedParts = uploadResults.length;
                    const percentage = Math.round((completedParts / totalParts) * 100);
                    onProgress(percentage);
                }

                if (controller.signal.aborted) {
                    throw new Error('업로드가 취소되었습니다.');
                }

                const completionData = {
                    programId: videoFileInfo.programId,
                    uploadId: videoFileInfo.uploadId,
                    completedAt: new Date().toISOString(),
                    parts: uploadResults,
                };

                await notifyUploadCompletion(completionData, userId);
                onStatus('uploaded');
            } catch (error) {
                onStatus('error');
                throw error;
            }
        },
        [userId],
    );

    const cancelUpload = useCallback(() => {
        abortController?.abort();
    }, [abortController]);

    useEffect(() => {
        if (isUploading) return;

        const pendingFile = fileList.find((item) => item.status === 'pending');
        if (pendingFile === undefined) {
            return;
        }

        const handleProgress = (progress: number) =>
            setFileList((prev) =>
                prev.map((file) =>
                    file.id === pendingFile.id ? { ...file, status: 'uploading', progress: progress } : file,
                ),
            );

        const handleStatus = (status: MediaFileStatus) =>
            setFileList((prev) =>
                prev.map((file) => (file.id === pendingFile.id ? { ...file, status: status } : file)),
            );

        setIsUploading(true);
        uploadSingleFile(pendingFile, handleProgress, handleStatus).finally(() => setIsUploading(false));
    }, [userId, isUploading, fileList, uploadSingleFile]);

    return {
        isUploading,
        fileList,
        setFileList,
        removeFile,
        cancelUpload,
    };
}
export default useFileUploads;
