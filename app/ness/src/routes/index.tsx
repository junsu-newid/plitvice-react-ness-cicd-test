import { createBrowserRouter } from 'react-router';
import FileUpload from '@/features/fileUpload';
import EncodingFileList from '@/features/encodingFileList';
import EncodingServerStatus from '@/features/encodingServerStatus';
import EncodingPresetList from '@/features/encodingPresetList';
import RootLayout from '@/common/layouts/RootLayout';
import { getPresetList } from '@/services/preset';
import { getFileList, getDefaultDateRange } from '@/services/fileList';
import { getServerStatus } from '@/services/serverStatus';
import { getUserId } from '@/utils';

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        errorElement: <div>404 Not Found</div>, // 공통 에러페이지 컴포넌트 추가 영역
        children: [
            {
                index: true,
                Component: FileUpload,
                hydrateFallbackElement: <div>HydrateFallbackElement</div>,
            },
            {
                path: '/file-list',
                Component: EncodingFileList,
                loader: async () => {
                    const userId = getUserId();
                    const { startDate, endDate } = getDefaultDateRange(); // MM-DD-YYYY 형식
                    return await getFileList({
                        uploadUserId: userId,
                        startDate,
                        endDate,
                    });
                },
            },
            {
                path: '/server-status',
                Component: EncodingServerStatus,
                loader: async () => {
                    return await getServerStatus();
                },
            },
            {
                path: '/preset-list',
                Component: EncodingPresetList,
                loader: async () => {
                    const userId = getUserId();
                    return await getPresetList(userId);
                },
            },
        ],
    },
]);

export default router;
