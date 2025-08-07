import { type RouteConfig, route } from '@react-router/dev/routes';

const routes: RouteConfig = [
    route('ness', 'pages/index.tsx', { id: 'index' }),
    route('ness/file-upload', 'pages/fileUpload/index.tsx', { id: 'fileUpload' }),
    route('ness/queue-status', 'pages/queueStatus/index.tsx', { id: 'queueStatus' }),
    route('ness/server-status', 'pages/serverStatus/index.tsx', { id: 'serverStatus' }),
    route('ness/preset-list', 'pages/presetList/index.tsx', { id: 'presetList' }),
];

// if (process.env.NODE_ENV === 'development') {
//     routes.push(route('/__playground', 'components/_playground/playground.tsx'));
// }

export default routes;
