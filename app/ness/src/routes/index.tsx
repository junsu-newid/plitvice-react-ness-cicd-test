import { createBrowserRouter } from 'react-router';
import FileUpload from '@/features/fileUpload';
import RootLayout from '@/common/layouts/RootLayout';

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
            // 여기에 라우트 추가 및 로더 추가 예정.
        ],
    },
]);

export default router;
