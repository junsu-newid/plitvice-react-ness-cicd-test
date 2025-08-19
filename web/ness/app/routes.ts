import { layout, route, RouteConfig } from '@react-router/dev/routes';

const routes = [
    route('/', 'routes/index.tsx', { id: 'ness' }, [
        route('file-upload', 'routes/fileUpload/index.tsx'),
        layout('components/layouts/operation.tsx', [
            route('queue-status', 'routes/queueStatus/index.tsx'),
            route('server-status', 'routes/serverStatus/index.tsx'),
            route('preset-list', 'routes/presetList/index.tsx'),
        ]),
        route('deny', 'routes/permission.tsx', { id: 'permission' }),
        route('error', 'routes/error.tsx', { id: 'error' }),
        route('*', 'routes/404.tsx', { id: '404' }),
    ]),
] satisfies RouteConfig;
export default routes;
