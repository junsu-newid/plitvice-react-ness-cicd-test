import api from './api';

// 인코딩 파일 리스트 조회 관련 타입
interface EncodingFileParams {
    uploadUserId: string;
    startDate: string;
    endDate: string;
}

interface EncodingFileInfo {
    id: string;
    fileName: string;
    uploadDate: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    fileSize: number;
    duration: number;
    resolution: string;
    // 추가 필요한 필드들
}

interface EncodingFileListResponse {
    code: number;
    msg: string;
    data: {
        files: EncodingFileInfo[];
        total: number;
    };
}

// 인코딩 파일 리스트 조회 API
export const getEncodingFiles = async (params: EncodingFileParams): Promise<EncodingFileListResponse> => {
    const response = await api.get('api/v1/encoding/files', {
        searchParams: {
            uploadUserId: params.uploadUserId,
            startDate: params.startDate,
            endDate: params.endDate,
        },
    });

    return await response.json<EncodingFileListResponse>();
};

export type { EncodingFileParams, EncodingFileInfo, EncodingFileListResponse };
