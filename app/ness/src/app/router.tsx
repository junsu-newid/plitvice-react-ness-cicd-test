import { createBrowserRouter, RouterProvider } from 'react-router';
import FileUpload from '@/pages/home/features/fileUpload';
import EncodingFileList from '@/pages/home/features/encodingFileList';
import EncodingServerStatus from '@/pages/home/features/encodingServerStatus';
import EncodingPresetList from '@/pages/home/features/encodingPresetList';
import { getPresetList } from '@/api/models/preset.ts';
import { getFileList, getDefaultDateRange } from '@/api/models/fileList.ts';
import { getServerStatus } from '@/api/models/serverStatus.ts';
import { getUserId } from '@/utils';
import ErrorPage from '@/app/ErrorPage.tsx';
import HomeLayout from '@/pages/home';

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
                Component: EncodingFileList,
                errorElement: <ErrorPage />,
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
                errorElement: <ErrorPage />,
                loader: async () => {
                    return await getServerStatus();
                },
            },
            {
                path: '/preset-list',
                Component: EncodingPresetList,
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
