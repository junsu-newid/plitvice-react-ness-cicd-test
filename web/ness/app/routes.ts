// import { flatRoutes } from '@react-router/fs-routes';
// export default [...(await flatRoutes())];

import { type RouteConfig, route } from '@react-router/dev/routes';

const routes: RouteConfig = [
    // route('/brand', 'pages/brand.tsx'),
    // route('/healthcheck', 'pages/healthcheck.tsx'),
    // route('/color-scheme', 'actions/color-scheme/route.ts'),

    route('ness', 'pages/fileUploads/index.tsx', { id: 'fileUploads' }),
];

// if (process.env.NODE_ENV === 'development') {
//     routes.push(route('/__playground', 'components/_playground/playground.tsx'));
// }

export default routes;
