import { useTranslation } from 'react-i18next';
import '@plitvice/ui/styles/global.css';
import { useState } from 'react';
import { addDays, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
    SingleDatePickerBox,
    DateRange,
    DateRangePickerBox,
    SelectOption,
    TabMenu,
    Button,
    Drawer,
    SelectBox,
    TextInput,
    ComboBox,
} from '@plitvice/ui';

function App() {
    const { t } = useTranslation();

    const [open, setOpen] = useState<boolean>(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <div className="scrollbar relative mx-auto flex h-[100dvh] max-w-[1200px] flex-col items-center gap-3 overflow-auto">
            <h1 className="box-border w-full whitespace-nowrap break-words bg-gradient-to-r from-[rgb(0,111,185)] via-[rgb(111,44,135)] to-[rgb(221,37,20)] bg-clip-text text-center text-[10rem] leading-[1.2] text-transparent">
                {t('common.appName')}
            </h1>
            <Button onClick={toggleDrawer(true)} variant={'normal'}>
                Open
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)} width={400} className={'flex justify-center'}>
                <div>Hello Drawer</div>
            </Drawer>
            <DatePickerGroup />
            <TabMenu tabList={tabExample} />
            <TextInput
                label={'Label'}
                labelPosition={'inner'}
                size={'large'}
                width={300}
                supportingText={'SupportingText'}
            />
            <SelectBox
                width={300}
                size={'medium'}
                supportingText={'SupportingText'}
                supportingTextColor={'var(--color-red-600)'}
                optionList={tabExample}
            />
            <ComboBox width={300} label={'Label'} labelPosition={'outer'} size={'large'} optionList={tabExample} />
        </div>
    );
}

export default App;

const tabExample: SelectOption[] = [
    { value: 1, label: 'Action' },
    { value: 2, label: 'Comedy' },
    { value: 3, label: 'Romance' },
];

export const DatePickerGroup = () => {
    return (
        <div className="mb-3 flex flex-col gap-3">
            <SingleDatePicker />
            <RangeTimePicker />
        </div>
    );
};

const SingleDatePicker = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    return (
        <div className="flex flex-col gap-2">
            <p>일 선택</p>
            <SingleDatePickerBox
                placeholder="날짜를 선택하세요"
                width={200}
                showTime={false}
                buttonText={{ delete: '삭제', today: '오늘' }}
                locale={ko}
                value={selectedDate}
                onChange={setSelectedDate}
            />
        </div>
    );
};

const RangeTimePicker = () => {
    const today = startOfDay(new Date());
    const nextWeek = startOfDay(addDays(today, 7));

    const INITIAL_DATE_RANGE: DateRange = {
        from: today,
        to: nextWeek,
    };
    const [dateRange, setDateRange] = useState<DateRange>(INITIAL_DATE_RANGE);

    return (
        <div className="flex flex-col gap-2">
            <p>시작/종료일 및 시간 선택</p>
            <DateRangePickerBox width={350} showTime={true} value={dateRange} onChange={setDateRange} />
        </div>
    );
};
