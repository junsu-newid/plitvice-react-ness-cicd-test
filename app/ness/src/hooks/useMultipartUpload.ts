import { useState, useCallback } from 'react';
import ky from 'ky';

import { requestPresignedUrls, notifyUploadCompletion } from '@/services/fileUpload';
import { MediaMetadata } from '@/hooks/useMediaInfo';

interface FileWithMetadata {
    file: File;
    metadata: MediaMetadata;
    subtitles?: Array<{
        file: File;
        language: string;
    }>;
}

interface UploadProgress {
    fileName: string;
    uploadId: string;
    programId: string;
    totalParts: number;
    completedParts: number;
    percentage: number;
    status: 'waiting' | 'preparing' | 'uploading' | 'completed' | 'error';
    error?: string;
    parts: Array<{
        PartNumber: number;
        ETag: string;
    }>;
}

interface PartUploadResult {
    partNumber: number;
    etag: string;
}

export const useMultipartUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const [currentUploadingIndex, setCurrentUploadingIndex] = useState(-1);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB

    /**
     * 파일을 청크로 분할
     */
    const splitFileIntoChunks = (file: File): Blob[] => {
        const chunks: Blob[] = [];
        let offset = 0;

        while (offset < file.size) {
            const chunk = file.slice(offset, offset + CHUNK_SIZE);
            chunks.push(chunk);
            offset += CHUNK_SIZE;
        }

        return chunks;
    };

    /**
     * 단일 청크를 S3에 업로드
     */
    const uploadChunk = async (
        url: string,
        chunk: Blob,
        partNumber: number,
        signal: AbortSignal,
    ): Promise<PartUploadResult> => {
        try {
            const response = await ky.put(url, {
                body: chunk,
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                signal, // AbortSignal 추가
            });

            const etag = response.headers.get('ETag');
            if (!etag) {
                throw new Error('ETag를 받지 못했습니다.');
            }

            return {
                partNumber,
                etag: etag.replace(/"/g, ''), // ETag에서 따옴표 제거
            };
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log(`Part ${partNumber} 업로드 취소됨`);
                throw new Error('업로드가 취소되었습니다.');
            }
            console.error(`Part ${partNumber} 업로드 실패:`, error);
            throw error;
        }
    };

    /**
     * 단일 파일의 multipart upload 수행
     */
    const uploadSingleFile = useCallback(
        async (
            fileWithMetadata: FileWithMetadata,
            videoFileInfo: { uploadId: string; programId: string; preSignedUrls: string[] },
            fileIndex: number,
            signal: AbortSignal,
        ): Promise<UploadProgress> => {
            const { file } = fileWithMetadata;
            const { uploadId, programId, preSignedUrls } = videoFileInfo;

            try {
                // 취소 체크
                if (signal.aborted) {
                    throw new Error('업로드가 취소되었습니다.');
                }

                // 파일을 청크로 분할
                const chunks = splitFileIntoChunks(file);
                const totalParts = chunks.length;

                // 초기 진행률 설정
                const initialProgress: UploadProgress = {
                    fileName: file.name,
                    uploadId,
                    programId,
                    totalParts,
                    completedParts: 0,
                    percentage: 0,
                    status: 'uploading',
                    parts: [],
                };

                // 진행률 업데이트
                setUploadProgress((prev) => prev.map((p, index) => (index === fileIndex ? initialProgress : p)));

                const uploadResults: PartUploadResult[] = [];

                // 순차적으로 청크 업로드 (동기적으로)
                for (let i = 0; i < chunks.length; i++) {
                    // 취소 체크
                    if (signal.aborted) {
                        throw new Error('업로드가 취소되었습니다.');
                    }

                    const chunk = chunks[i];
                    const partNumber = i + 1;
                    const presignedUrl = preSignedUrls[i];

                    if (!presignedUrl) {
                        throw new Error(`Part ${partNumber}에 대한 presigned URL을 찾을 수 없습니다.`);
                    }

                    const result = await uploadChunk(presignedUrl, chunk, partNumber, signal);
                    uploadResults.push(result);

                    // 진행률 업데이트
                    const completedParts = uploadResults.length;
                    const percentage = Math.round((completedParts / totalParts) * 100);

                    const updatedProgress: UploadProgress = {
                        fileName: file.name,
                        uploadId,
                        programId,
                        totalParts,
                        completedParts,
                        percentage,
                        status: 'uploading',
                        parts: uploadResults.map((r) => ({
                            PartNumber: r.partNumber,
                            ETag: r.etag,
                        })),
                    };

                    setUploadProgress((prev) => prev.map((p, index) => (index === fileIndex ? updatedProgress : p)));
                }

                // 업로드 완료
                const completedProgress: UploadProgress = {
                    fileName: file.name,
                    uploadId,
                    programId,
                    totalParts,
                    completedParts: totalParts,
                    percentage: 100,
                    status: 'completed',
                    parts: uploadResults.map((r) => ({
                        PartNumber: r.partNumber,
                        ETag: r.etag,
                    })),
                };

                setUploadProgress((prev) => prev.map((p, index) => (index === fileIndex ? completedProgress : p)));

                console.log(`${file.name} 업로드 완료:`, uploadResults);
                return completedProgress;
            } catch (error) {
                console.error(`${file.name} 업로드 실패:`, error);

                const errorProgress: UploadProgress = {
                    fileName: file.name,
                    uploadId,
                    programId,
                    totalParts: 0,
                    completedParts: 0,
                    percentage: 0,
                    status: 'error',
                    error: error instanceof Error ? error.message : '알 수 없는 오류',
                    parts: [],
                };

                setUploadProgress((prev) => prev.map((p, index) => (index === fileIndex ? errorProgress : p)));

                throw error;
            }
        },
        [splitFileIntoChunks, uploadChunk, setUploadProgress],
    );

    /**
     * 자막 파일을 S3에 직접 업로드
     */
    const uploadSubtitleFile = async (_file: File, presignedUrl: string, signal?: AbortSignal): Promise<void> => {
        try {
            await ky.put(presignedUrl, {
                body: _file,
                headers: {
                    'Content-Type': 'application/x-subrip',
                },
                signal,
            });

            console.log(`자막 파일 업로드 완료: ${_file.name}`);
        } catch (error) {
            console.error(`자막 파일 업로드 실패: ${_file.name}`, error);
            throw error;
        }
    };

    /**
     * 여러 파일의 multipart upload 수행 (순차적)
     */
    const uploadFiles = useCallback(
        async (filesWithMetadata: FileWithMetadata[], uploadUserId: string): Promise<void> => {
            // 새로운 AbortController 생성
            const controller = new AbortController();
            setAbortController(controller);
            setIsUploading(true);
            setCurrentUploadingIndex(-1);

            try {
                // 1단계: Presigned URL 요청
                const fileRequestData = filesWithMetadata.map(({ metadata, subtitles }) => ({
                    fileName: metadata.fileName,
                    extension: metadata.extension,
                    resolution: metadata.resolution,
                    fileSize: metadata.fileSize,
                    duration: metadata.duration,
                    bitrate: metadata.bitrate,
                    codecInfo: metadata.codecInfo,
                    frameRate: metadata.frameRate,
                    audioCodec: metadata.audioCodec,
                    audioBitRate: metadata.audioBitRate,
                    subtitleFiles: subtitles?.map((sub) => sub.file.name) || null,
                }));

                console.log('Presigned URL 요청 중...', fileRequestData);
                const presignedResponse = await requestPresignedUrls(fileRequestData, uploadUserId);

                if (presignedResponse.code !== 20000 || !presignedResponse.data) {
                    throw new Error(`Presigned URL 요청 실패: ${presignedResponse.msg}`);
                }

                const videoFileList = presignedResponse.data.videoFileList;
                console.log('Presigned URL 받음:', videoFileList);

                // 2단계: 초기 진행률 설정 (모든 파일이 대기 상태)
                const initialProgress: UploadProgress[] = filesWithMetadata.map((fileWithMetadata, index) => ({
                    fileName: fileWithMetadata.file.name,
                    uploadId: videoFileList[index]?.uploadId || '',
                    programId: videoFileList[index]?.programId || '',
                    totalParts: 0,
                    completedParts: 0,
                    percentage: 0,
                    status: 'waiting' as const,
                    parts: [],
                }));

                setUploadProgress(initialProgress);

                // 3단계: 순차적으로 파일 업로드
                const completedUploads: UploadProgress[] = [];

                for (let i = 0; i < filesWithMetadata.length; i++) {
                    // 취소 체크
                    if (controller.signal.aborted) {
                        console.log('업로드가 취소되었습니다.');
                        return;
                    }

                    setCurrentUploadingIndex(i);

                    const fileWithMetadata = filesWithMetadata[i];
                    const videoFileInfo = videoFileList[i];

                    if (!videoFileInfo) {
                        throw new Error(`${fileWithMetadata.file.name}에 대한 presigned URL을 찾을 수 없습니다.`);
                    }

                    // 현재 파일 상태를 '준비중'으로 변경
                    setUploadProgress((prev) =>
                        prev.map((p, index) => (index === i ? { ...p, status: 'preparing' as const } : p)),
                    );

                    // 3-1: 자막 파일들 먼저 업로드
                    if (
                        fileWithMetadata.subtitles &&
                        fileWithMetadata.subtitles.length > 0 &&
                        videoFileInfo.subtitles
                    ) {
                        console.log(`자막 파일 업로드 시작: ${fileWithMetadata.file.name}`);

                        for (const subtitle of fileWithMetadata.subtitles) {
                            // 취소 체크
                            if (controller.signal.aborted) {
                                console.log('업로드가 취소되었습니다.');
                                return;
                            }

                            const subtitlePresignedUrl = videoFileInfo.subtitles.find(
                                (s) => s.language === subtitle.language,
                            )?.presignedUrl;

                            if (subtitlePresignedUrl) {
                                await uploadSubtitleFile(subtitle.file, subtitlePresignedUrl, controller.signal);
                            } else {
                                console.warn(
                                    `자막 파일 ${subtitle.file.name}에 대한 presigned URL을 찾을 수 없습니다.`,
                                );
                            }
                        }
                    }

                    // 3-2: MP4 파일 multipart 업로드
                    const completedUpload = await uploadSingleFile(
                        fileWithMetadata,
                        videoFileInfo,
                        i,
                        controller.signal,
                    );
                    completedUploads.push(completedUpload);
                }

                setCurrentUploadingIndex(-1);

                // 취소 체크 - complete API 호출 전에 한 번 더 확인
                if (controller.signal.aborted) {
                    console.log('업로드가 취소되어 complete API 호출을 건너뜁니다.');
                    return;
                }

                // 4단계: 업로드 완료 알림 (취소되지 않은 경우에만)
                console.log('업로드 완료 알림 전송 중...');

                const completionData = completedUploads.map((upload, index) => ({
                    programId: videoFileList[index].programId,
                    uploadId: upload.uploadId,
                    completedAt: new Date().toISOString(),
                    parts: upload.parts,
                }));

                try {
                    const completionResponse = await notifyUploadCompletion(completionData, uploadUserId);
                    console.log('모든 파일 업로드 완료:', completionResponse);
                } catch (completionError) {
                    console.warn('업로드 완료 알림 API 호출 실패:', completionError);
                    console.log(
                        '파일 업로드는 성공했지만 서버 알림에 실패했습니다. 파일은 정상적으로 업로드되었습니다.',
                    );
                    // 사용자에게는 성공으로 처리 (실제 파일 업로드는 완료되었으므로)
                }
            } catch (error) {
                // 취소로 인한 에러인지 확인
                if (controller.signal.aborted || (error instanceof Error && error.message.includes('취소'))) {
                    console.log('업로드 취소됨');
                    return;
                }

                console.error('파일 업로드 실패:', error);

                // 실패한 파일들의 상태 업데이트
                setUploadProgress((prev) =>
                    prev.map((p) =>
                        p.status === 'waiting' || p.status === 'preparing' || p.status === 'uploading'
                            ? {
                                  ...p,
                                  status: 'error' as const,
                                  error: error instanceof Error ? error.message : '업로드 실패',
                              }
                            : p,
                    ),
                );

                throw error;
            } finally {
                setIsUploading(false);
                setCurrentUploadingIndex(-1);
                setAbortController(null);
            }
        },
        [uploadSingleFile],
    );

    /**
     * 업로드 취소
     */
    const cancelUpload = useCallback(() => {
        console.log('업로드 취소 요청됨');

        // 진행 중인 요청들 취소
        if (abortController) {
            abortController.abort();
        }

        setIsUploading(false);
        setCurrentUploadingIndex(-1);
        setUploadProgress([]);
    }, [abortController]);

    return {
        uploadFiles,
        cancelUpload,
        isUploading,
        uploadProgress,
        currentUploadingIndex,
    };
};
