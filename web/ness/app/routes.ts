import { index, route, RouteConfig } from '@react-router/dev/routes';

const routes = [
    route('*', 'routes/$.tsx'),
    index('routes/index.tsx'),
    route('file-upload', 'routes/fileUpload/index.tsx', { id: 'fileUpload' }),
    route('queue-status', 'routes/queueStatus/index.tsx', { id: 'queueStatus' }),
    route('server-status', 'routes/serverStatus/index.tsx', { id: 'serverStatus' }),
    route('preset-list', 'routes/presetList/index.tsx', { id: 'presetList' }),
] satisfies RouteConfig;
export default routes;
