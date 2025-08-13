// import { LoaderFunctionArgs } from 'react-router';
//
// import { getUserEncryptKeyFromSession } from '@/utils/sessionUtil';
//
// export const compose = (...middlewares: Function[]) => {
//     return (loaderFn: Function) => {
//         return middlewares.reduceRight((acc, middleware) => {
//             return middleware(acc);
//         }, loaderFn);
//     };
// };
//
// export const isLoggedIn = (loaderFn: Function) => {
//     return async (args: LoaderFunctionArgs) => {
//         const userEncryptKey = await getUserEncryptKeyFromSession(args);
//         return loaderFn({ ...args, userEncryptKey });
//     };
// };
//
// export const withPermission = (requiredPermission: string) => (loaderFn: Function) => {
//     return async ({ request, ...rest }: { request: Request; [key: string]: any }) => {
//         // TODO?: group 추가 필요
//         const userGroup = 'cp'; // 임시 기본값
//         if (userGroup !== requiredPermission) {
//             return new Response('', {
//                 status: 302,
//                 headers: {
//                     Location: '/ness/file-upload',
//                 },
//             });
//         }
//         return loaderFn({ request, userGroup, ...rest });
//     };
// };
//
// // TODO: 에러 로직 점검
// export const errorHandler = (loaderFn: Function) => {
//     return async ({ request, ...rest }: { request: Request; [key: string]: any }) => {
//         try {
//             return await loaderFn({ request, ...rest });
//         } catch (error) {
//             console.log('Error caught in errorHandler:', error);
//             if (error instanceof Response) {
//                 console.log('API Response error:', error.status, error.statusText);
//                 return new Response('', {
//                     status: 302,
//                     headers: {
//                         Location: '/ness/login',
//                     },
//                 });
//             }
//
//             if (error instanceof Error) {
//                 console.log('General error:', error.message);
//                 return new Response('', {
//                     status: 302,
//                     headers: {
//                         Location: '/ness/login',
//                     },
//                 });
//             }
//
//             // 기타 에러
//             console.log('Unknown error:', error);
//             return new Response('', {
//                 status: 302,
//                 headers: {
//                     Location: '/ness/login',
//                 },
//             });
//         }
//     };
// };
//
// export const commonLoader = compose(isLoggedIn, errorHandler);
// export const commonLoaderWithPermission = compose(isLoggedIn, withPermission('admin'), errorHandler);
