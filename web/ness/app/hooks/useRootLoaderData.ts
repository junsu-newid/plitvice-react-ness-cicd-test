import { useRouteLoaderData } from 'react-router';

import { RootLoaderData } from '@/routes/index.tsx';

import { GLOBAL_ROUTE_ID } from '@/types/enum.ts';

export const useRootLoaderData = () => {
    const data = useRouteLoaderData<RootLoaderData>(GLOBAL_ROUTE_ID);

    if (!data) {
        throw new Error('useRootLoaderData must be used within the root layout');
    }

    return data;
};
