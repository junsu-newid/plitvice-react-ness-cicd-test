import { Column } from '@tanstack/react-table';
import { SortingIcon } from '@plitvice/ui';

type Props<T extends object> = {
    title: string;
    column: Column<T, string>;
};
function SortHeader<T extends object>({ title, column }: Props<T>) {
    const sorted = column.getIsSorted();
    const opacity = sorted == false ? 'opacity-0 group-hover:opacity-50' : 'opacity-100';
    const rotate = sorted === 'desc' ? 'rotate-180' : '';

    return (
        <button
            className="text-grey-70 group flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {title}
            <SortingIcon className={`text-grey-50 ${opacity} ${rotate}`} />
        </button>
    );
}
export default SortHeader;
