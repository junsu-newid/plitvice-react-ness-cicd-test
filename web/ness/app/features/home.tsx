import { Button, Drawer } from '@plitvice/ui';
import { useState } from 'react';

export default function Home() {
    const [open, setOpen] = useState<boolean>(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <div className="scrollbar relative mx-auto flex h-[100dvh] max-w-[1200px] flex-col items-center gap-3 overflow-auto">
            <h1 className="box-border w-full whitespace-nowrap break-words bg-gradient-to-r from-[rgb(0,111,185)] via-[rgb(111,44,135)] to-[rgb(221,37,20)] bg-clip-text text-center text-[10rem] leading-[1.2] text-transparent">
                proj A
            </h1>
            <Button onClick={toggleDrawer(true)} variant={'normal'}>
                Open
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)} width={400} className={'flex justify-center'}>
                <div>Hello Drawer</div>
            </Drawer>
        </div>
    );
}
