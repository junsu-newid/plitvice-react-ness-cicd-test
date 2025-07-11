import { createBrowserRouter, RouterProvider } from 'react-router';
import FileUpload from '@/pages/encoding/features/fileUpload';
import EncodingPreset from '@/pages/encoding/features/presetList';
import { getPresetList } from '@/api/models/preset.ts';
// import { getDefaultDateRange } from '@/api/models/fileList.ts';
// import { fetchFileList } from '@/api/services/fileList.ts';
import { fetchServerStatus } from '@/api/services/serverStatus.ts';
import { getUserId } from '@/utils';
import ErrorPage from '@/app/ErrorPage.tsx';
import HomeLayout from '@/pages/encoding';
import { lazy } from 'react';
import mockFiles from '@/mockFileList.json';

const ServerStatusPage = lazy(() => import('@/pages/encoding/features/serverStatus'));
const EncodingFileListPage = lazy(() => import('@/pages/encoding/features/encodingFileList'));

const router = createBrowserRouter([
    {
        path: '/',
        Component: HomeLayout,
        errorElement: <div>404 Not Found</div>, // 공통 에러페이지 컴포넌트 추가 영역
        children: [
            {
                index: true,
                Component: FileUpload,
                errorElement: <ErrorPage />,
                hydrateFallbackElement: <div>HydrateFallbackElement</div>,
            },
            {
                path: '/file-list',
                Component: EncodingFileListPage,
                errorElement: <ErrorPage />,
                // loader: async () => {
                //     const userId = getUserId();
                //     const { startDate, endDate } = getDefaultDateRange(); // MM-DD-YYYY 형식
                //     return await fetchFileList({
                //         uploadUserId: userId,
                //         startDate,
                //         endDate,
                //     });
                // },
                loader: () => mockFiles,
            },
            {
                path: '/server-status',
                Component: ServerStatusPage,
                errorElement: <ErrorPage />,
                loader: async () => {
                    return await fetchServerStatus();
                },
            },
            {
                path: '/preset-list',
                Component: EncodingPreset,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const userId = getUserId();
                    return await getPresetList(userId);
                },
            },
        ],
    },
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};
export default AppRouter;
