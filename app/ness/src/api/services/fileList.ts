import api from '../index.ts';
import { FileListParams, FileListResponse } from '@/api/models/queueList.ts';

export const fetchFileList = async (params: FileListParams): Promise<FileListResponse> => {
    const searchParams = new URLSearchParams({
        uploadUserId: params.uploadUserId,
        startDate: params.startDate,
        endDate: params.endDate,
    });

    return await api.get(`encoding/files?${searchParams.toString()}`).json<FileListResponse>();
};
