import { index, route, RouteConfig } from '@react-router/dev/routes';

const routes = [
    index('routes/index.tsx'),
    route('file-upload', 'routes/fileUpload/index.tsx', { id: 'fileUpload' }),
    route('queue-status', 'routes/queueStatus/index.tsx', { id: 'queueStatus' }),
    route('server-status', 'routes/serverStatus/index.tsx', { id: 'serverStatus' }),
    route('preset-list', 'routes/presetList/index.tsx', { id: 'presetList' }),
    route('error', 'routes/$.tsx', { id: 'error' }),
    route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
export default routes;
