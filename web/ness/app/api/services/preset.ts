import api from '@/api';
import { PresetResponse } from '@/api/models/preset.ts';

export const fetchPresetList = async (userEncryptKey: string): Promise<PresetResponse> => {
    return await api.get(`preset`, { searchParams: { userEncryptKey } }).json<PresetResponse>();
};
