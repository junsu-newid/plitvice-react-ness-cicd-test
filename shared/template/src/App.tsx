import { useTranslation } from 'react-i18next';
import '@plitvice/ui/styles/global.css';
import { Button, Drawer, SelectBox, SelectOption } from '@plitvice/ui';
import { useState } from 'react';

function App() {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<SelectOption>();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <div className="relative mx-auto flex h-[100dvh] max-w-[1200px] flex-col items-center justify-center gap-3">
            <h1 className="box-border w-full whitespace-nowrap break-words bg-gradient-to-r from-[rgb(0,111,185)] via-[rgb(111,44,135)] to-[rgb(221,37,20)] bg-clip-text text-center text-[10rem] leading-[1.2] text-transparent">
                {t('common.appName')}
            </h1>
            <SelectBox optionList={defaultComboBoxOptions} width={400} value={selected} onChange={setSelected} />
            <Button onClick={toggleDrawer(true)} variant={'normal'} fill={false}>
                Open Drawer
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)} width={400} className={'flex justify-center'}>
                <div>Hello Drawer</div>
            </Drawer>
        </div>
    );
}

export default App;

const defaultComboBoxOptions: SelectOption[] = [
    { value: 1, label: 'Item01' },
    { value: 2, label: 'Item02' },
    { value: 3, label: 'Item03' },
];
