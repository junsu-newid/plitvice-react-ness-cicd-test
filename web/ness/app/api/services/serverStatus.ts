import api from '@/api';
import { ServerStatusResponse } from '@/api/models/serverStatus.ts';

export const fetchServerStatus = async (userEncryptKey: string): Promise<ServerStatusResponse> => {
    return await api.get('encoding/servers/status', { searchParams: { userEncryptKey } }).json<ServerStatusResponse>();
};

export const putServerStatus = async (instanceId: string, status: string): Promise<ServerStatusResponse> => {
    return await api
        .put('encoding/server/status', {
            searchParams: { instanceId, status },
        })
        .json<ServerStatusResponse>();
};
