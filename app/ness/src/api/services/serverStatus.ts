import api from '@/api';
import { ServerStatusResponse } from '@/api/models/serverStatus.ts';

export const fetchServerStatus = async (): Promise<ServerStatusResponse> => {
    return await api.get('encoding/servers/status').json<ServerStatusResponse>();
};
