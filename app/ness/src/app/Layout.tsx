import { ReactNode, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router';
import { getUserId } from '@/utils';
import { useUser } from '@/hooks/useUser.ts';
import LoadingMask from '@/app/LoadingMask.tsx';

interface Props {
    children: ReactNode;
}
const Layout = ({ children }: Props) => {
    const { authenticate } = useUser();

    useEffect(() => {
        authenticate(getUserId);
    }, [authenticate]);

    return (
        <div
            className={
                'relative grid h-full w-full grid-cols-[240px_1fr] grid-rows-[60px_1fr] justify-start overflow-hidden'
            }
        >
            <div className={`col-span-2 bg-blue-600 px-[24px] py-[16px]`}>
                <a href={`./`}>
                    <img src={`/logo.png`} width={110} height={28} alt={'logo'} />
                </a>
            </div>
            <div className={`overflow-hidden`}>{children}</div>
            <div className={'bg-grey-5 border-grey-20 relative h-full w-full overflow-auto border-l'}>
                <Suspense fallback={<LoadingMask />}>
                    <Outlet />
                </Suspense>
                <LoadingMask />
            </div>
        </div>
    );
};
export default Layout;
