import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { MediaFile } from '@/types/mediainfo.types';
import useFileUploads from '@/pages/encoding/index.hooks.ts';
import { useTranslation } from 'react-i18next';

interface FileUploadsContextType {
    isUploading: boolean;
    fileList: MediaFile[];
    setFileList: React.Dispatch<React.SetStateAction<MediaFile[]>>;
    removeFile: (fileId: string) => void;
    cancelUpload: () => void;
}

const FileUploadsContext = createContext<FileUploadsContextType | null>(null);

export const FileUploadsProvider = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();
    const fileUploads = useFileUploads();

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = t('fileUploads.alertNowUploading');
        };

        if (fileUploads.isUploading) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [fileUploads.isUploading, t]);

    return <FileUploadsContext.Provider value={fileUploads}>{children}</FileUploadsContext.Provider>;
};

export const useFileUploadsContext = (): FileUploadsContextType => {
    const context = useContext(FileUploadsContext);
    if (!context) {
        throw new Error('useFileUploadsContext must be used within a FileUploadsProvider');
    }
    return context;
};
