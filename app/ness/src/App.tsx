import { RouterProvider } from 'react-router';
import router from '@/routes';
import '@plitvice/ui/styles/global.css';

function App() {
    return <RouterProvider router={router} />;
}

export default App;

// import { useTranslation } from 'react-i18next';
// import { addDays, startOfDay } from 'date-fns';
// import { ko } from 'date-fns/locale';
// import { SingleDatePickerBox, DateRange, DateRangePickerBox, SelectOption, TabMenu } from '@plitvice/ui';

// const { t } = useTranslation();
// return (
//     <div className="scrollbar relative mx-auto flex h-[100dvh] max-w-[1200px] flex-col items-center gap-3 overflow-auto">
//         <div className="mx-auto w-full">
//             <h1 className="mb-8 text-center text-2xl font-bold">MP4 파일 업로드</h1>

//             <div className="mb-6 rounded-lg bg-white p-6 shadow">
//                 <label className="mb-2 block text-sm font-medium text-gray-700">업로드 사용자 ID</label>
//                 <input
//                     type="text"
//                     value={uploadUserId}
//                     onChange={(e) => setUploadUserId(e.target.value)}
//                     placeholder="사용자 ID를 입력하세요"
//                     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//             </div>

//             <div className="rounded-lg bg-white shadow">
//                 <FileUpload uploadUserId={uploadUserId} />
//             </div>
//         </div>
//     </div>
// );

// const SingleDatePicker = () => {
//     const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

//     return (
//         <div className="flex flex-col gap-2">
//             <p>일 선택</p>
//             <SingleDatePickerBox
//                 placeholder="날짜를 선택하세요"
//                 width={200}
//                 showTime={false}
//                 buttonText={{ delete: '삭제', today: '오늘' }}
//                 locale={ko}
//                 value={selectedDate}
//                 onChange={setSelectedDate}
//             />
//         </div>
//     );
// };

// const RangeTimePicker = () => {
//     const today = startOfDay(new Date());
//     const nextWeek = startOfDay(addDays(today, 7));

//     const INITIAL_DATE_RANGE: DateRange = {
//         from: today,
//         to: nextWeek,
//     };
//     const [dateRange, setDateRange] = useState<DateRange>(INITIAL_DATE_RANGE);

//     return (
//         <div className="flex flex-col gap-2">
//             <p>시작/종료일 및 시간 선택</p>
//             <DateRangePickerBox width={350} showTime={true} value={dateRange} onChange={setDateRange} />
//         </div>
//     );
// };
