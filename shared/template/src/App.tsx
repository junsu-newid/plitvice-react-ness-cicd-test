import { useTranslation } from 'react-i18next';
import '@plitvice/ui/styles/global.css';
import { Button, Drawer, ModInput, ModSelectBox, SelectOption } from '@plitvice/ui';
import { CellInput } from '@plitvice/ui/components/textfield/CellInput.tsx';
import { useState } from 'react';

function App() {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <div className="relative mx-auto flex h-[100dvh] max-w-[1200px] flex-col items-center justify-center gap-3">
            <h1 className="box-border w-full whitespace-nowrap break-words bg-gradient-to-r from-[rgb(0,111,185)] via-[rgb(111,44,135)] to-[rgb(221,37,20)] bg-clip-text text-center text-[10rem] leading-[1.2] text-transparent">
                {t('common.appName')}
            </h1>
            <CellInput width={400} value={'test'} onDone={console.log} />
            <ExampleModifiedField />
            <ModSelectBox width={400} optionList={defaultComboBoxOptions} value={defaultComboBoxOptions[0]} />
            <Button onClick={toggleDrawer(true)} variant={'normal'}>
                Open Drawer
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)} width={400} className={'flex justify-center'}>
                <div>Hello Drawer</div>
            </Drawer>
        </div>
    );
}

export default App;

const ExampleModifiedField = () => {
    return <ModInput width={400} value={'origin text'} />;
};

const defaultComboBoxOptions: SelectOption[] = [
    { value: 'item01', label: 'Item01' },
    { value: 'item02', label: 'Item02' },
    { value: 'item03', label: 'Item03' },
];
