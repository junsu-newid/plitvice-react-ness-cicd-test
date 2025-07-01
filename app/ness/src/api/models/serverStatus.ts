import api from '../index.ts';

export interface ServerInstance {
    instanceId: string;
    instanceName: string;
    status: string;
    serverType: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServerStatusResponse {
    code: number;
    msg: string;
    data: ServerInstance[];
}

export const getServerStatus = async (): Promise<ServerStatusResponse> => {
    return await api.get('encoding/servers/status').json<ServerStatusResponse>();
};
