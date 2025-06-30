import api from './api';

export interface EncodingStatistics {
    total: number;
    pending: number;
    running: number;
    completed: number;
    stopped: number;
}

export interface EncodingFileItem {
    programId: string;
    programTitle: string | null;
    status: string;
    type: string;
    duration: number;
    startedAt: string;
    finishedAt: string | null;
    totalTimeSpent: number | null;
    notes: string | null;
}

export interface EncodingFilesData {
    statistics: EncodingStatistics;
    encodingFileList: EncodingFileItem[];
}

export interface FileListResponse {
    code: number;
    msg: string;
    data: EncodingFilesData;
}

export interface FileListParams {
    uploadUserId: string;
    startDate: string; // MM-DD-YYYY format
    endDate: string; // MM-DD-YYYY format
}

export const getFileList = async (params: FileListParams): Promise<FileListResponse> => {
    const searchParams = new URLSearchParams({
        uploadUserId: params.uploadUserId,
        startDate: params.startDate,
        endDate: params.endDate,
    });

    return await api.get(`encoding/files?${searchParams.toString()}`).json<FileListResponse>();
};

// 날짜 유틸리티 함수들 - MM-DD-YYYY 형식으로 변경
export const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};

// HTML input[type="date"]는 YYYY-MM-DD 형식을 사용하므로 변환 함수 추가
export const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const parseDateFromInput = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`; // MM-DD-YYYY로 변환
};

export const getDefaultDateRange = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
        startDate: formatDate(thirtyDaysAgo), // MM-DD-YYYY
        endDate: formatDate(today), // MM-DD-YYYY
    };
};

export const getDefaultDateRangeForInput = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
        startDate: formatDateForInput(thirtyDaysAgo), // YYYY-MM-DD for input
        endDate: formatDateForInput(today), // YYYY-MM-DD for input
    };
};
