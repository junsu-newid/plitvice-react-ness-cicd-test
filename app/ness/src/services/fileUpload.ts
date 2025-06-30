import api from './api';

// 중복파일 검증 요청 타입
interface FileValidateRequest {
    files: Array<{
        fileName: string;
    }>;
}

// 중복파일 검증 응답 타입
interface FileValidateResponse {
    code: number;
    msg: string;
    data: boolean | string;
}

// 파일 업로드 관련 타입
interface FileUploadRequest {
    files: Array<{
        fileName: string;
        extension: string;
        resolution: string;
        fileSize: number;
        duration: number;
        bitrate: number;
        codecInfo: string;
        frameRate: number;
        audioCodec: string;
        audioBitRate: number;
        subtitleFiles: string[] | null;
    }>;
}

// 파일 업로드 응답 타입
interface VideoFileInfo {
    fileName: string;
    programId: string;
    storagePath: string;
    uploadId: string;
    preSignedUrls: string[];
    createdAt: string;
    updatedAt: string;
    subtitles?: Array<{
        presignedUrl: string;
        language: string;
        filename: string;
    }>;
}

interface FileUploadResponse {
    code: number;
    msg: string;
    data: {
        videoFileList: VideoFileInfo[];
    };
}

// 업로드 완료 관련 타입
interface UploadCompletionRequest {
    files: Array<{
        programId: string;
        uploadId: string;
        completedAt: string;
        parts: Array<{
            PartNumber: number;
            ETag: string;
        }>;
    }>;
}

interface UploadCompletionResponse {
    status_code: number;
    data: string;
}

// 파일 목록 조회 관련 타입
interface UploadedFileItem {
    fileName: string;
    programId: string;
    presetId: number;
    languages: string | null;
    createdAt: string;
    updatedAt: string;
}

interface FileListResponse {
    code: number;
    msg: string;
    data: UploadedFileItem[];
}

export interface FileValidationRequest {
    fileName: string;
}

export interface FileValidationResponse {
    code: number;
    data: boolean;
    msg: string;
}

export interface FileUploadInitiateRequest {
    file_name: string;
    file_size: number;
    file_type: string;
    upload_path: string;
    upload_user: string;
}

export interface FileUploadInitiateResponse {
    file_id: string;
    parts: Array<{
        part_number: number;
        url: string;
    }>;
}

export interface FileUploadCompleteRequest {
    file_id: string;
    parts: Array<{
        part_number: number;
        etag: string;
    }>;
}

export interface FileUploadCompleteResponse {
    file_id: string;
    file_url: string;
}

// 파일 검증 API (ky 사용)
export const validateFiles = async (
    files: Array<{ fileName: string }>,
    uploadUserId: string,
): Promise<FileValidateResponse> => {
    const response = await api.post('upload/files/validate', {
        json: { files } as FileValidateRequest,
        searchParams: {
            uploadUserId,
        },
    });

    return await response.json<FileValidateResponse>();
};

// Presigned URL 요청 API
export const requestPresignedUrls = async (
    files: Array<{
        fileName: string;
        extension: string;
        resolution: string;
        fileSize: number;
        duration: number;
        bitrate: number;
        codecInfo: string;
        frameRate: number;
        audioCodec: string;
        audioBitRate: number;
        subtitleFiles?: string[] | null;
    }>,
    uploadUserId: string,
): Promise<FileUploadResponse> => {
    const requestData: FileUploadRequest = {
        files: files.map((file) => ({
            ...file,
            subtitleFiles: file.subtitleFiles || null,
        })),
    };

    const response = await api.post('upload/files', {
        json: requestData,
        searchParams: {
            uploadUserId,
        },
    });

    return await response.json<FileUploadResponse>();
};

// 업로드 완료 알림 API
export const notifyUploadCompletion = async (
    files: Array<{
        programId: string;
        uploadId: string;
        completedAt: string;
        parts: Array<{
            PartNumber: number;
            ETag: string;
        }>;
    }>,
    uploadUserId: string,
): Promise<UploadCompletionResponse> => {
    const requestData: UploadCompletionRequest = {
        files,
    };

    try {
        const response = await api.post('upload/files/completed', {
            json: requestData,
            searchParams: {
                uploadUserId,
            },
        });

        const result = await response.json<UploadCompletionResponse>();

        return result;
    } catch (error) {
        console.error('업로드 완료 알림 에러:', {
            error,
            requestData,
            uploadUserId,
        });

        // 에러 상세 정보 로그
        if (error instanceof Error) {
            console.error('에러 메시지:', error.message);
            console.error('에러 스택:', error.stack);
        }

        throw error;
    }
};

// 업로드된 파일 목록 조회 API
export const getUploadedFiles = async (uploadUserId: string): Promise<FileListResponse> => {
    const response = await api.get('upload/files', {
        searchParams: {
            uploadUserId,
        },
    });

    return await response.json<FileListResponse>();
};

// 타입들을 export (다른 곳에서 사용할 수 있도록)
export type {
    FileValidateRequest,
    FileValidateResponse,
    FileUploadRequest,
    VideoFileInfo,
    FileUploadResponse,
    UploadCompletionRequest,
    UploadCompletionResponse,
    UploadedFileItem,
    FileListResponse,
};
