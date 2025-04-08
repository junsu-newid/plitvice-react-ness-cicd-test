import { useTranslation } from 'react-i18next';
import '@plitvice/ui/styles/global.css';
import SearchField from '@plitvice/ui/components/searchfield';
import { SelectOption } from '@plitvice/ui/components/dropdownList';
import SelectBox from '@plitvice/ui/components/selectbox';
import ComboBox from '@plitvice/ui/components/combobox';
import TextField from '@plitvice/ui/components/textfield/TextField.tsx';

function App() {
    const { t } = useTranslation();

    return (
        <div className="relative mx-auto flex h-[100dvh] max-w-[1200px] flex-col items-center justify-center gap-3">
            <h1 className="box-border w-full whitespace-nowrap break-words bg-gradient-to-r from-[rgb(0,111,185)] via-[rgb(111,44,135)] to-[rgb(221,37,20)] bg-clip-text text-center text-[10rem] leading-[1.2] text-transparent">
                {t('common.appName')}
            </h1>
            <ExampleSearchField />
            <ExampleTextField />
            <ExampleSelectBox />
            <ExampleComboBox />
        </div>
    );
}

export default App;

const ExampleSearchField = () => {
    return <SearchField width={300} />;
};

const ExampleTextField = () => {
    return <TextField width={300} size={'large'} label={'Label'} labelPosition={'inner'} />;
};

const ExampleSelectBox = () => {
    const optionList: SelectOption[] = [
        { value: 'item01', label: 'Item01' },
        { value: 'item02', label: 'Item02' },
        { value: 'item03', label: 'Item03' },
    ];

    const handleChange = (value: SelectOption) => {
        console.log('셀렉트 값이 변경됨:', value);
    };

    return (
        <SelectBox
            size={'small'}
            width={300}
            label={'Label'}
            labelColor={'#ff0000'}
            value={optionList[0]}
            optionList={optionList}
            onChange={handleChange}
            disabled={false}
        />
    );
};

const ExampleComboBox = () => {
    const optionList: SelectOption[] = [
        { value: 'item01', label: 'Item01' },
        { value: 'item02', label: 'Item02' },
        { value: 'item03', label: 'Item03' },
    ];

    const handleChange = (value: SelectOption) => {
        console.log('셀렉트 값이 변경됨:', value);
    };

    return (
        <ComboBox
            size={'medium'}
            width={300}
            label={'Label'}
            labelColor={'#ff0000'}
            labelPosition={'inner'}
            optionList={optionList}
            onChange={handleChange}
            disabled={false}
        />
    );
};
