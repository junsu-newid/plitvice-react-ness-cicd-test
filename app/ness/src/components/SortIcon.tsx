import { SortIconType } from '@/types/enum.ts';
import { SortingIcon } from '@plitvice/ui';

const SortIcon = ({ sorted }: SortIconType) => {
    switch (sorted) {
        case 'asc':
            return (
                <span className="text-grey-50">
                    <SortingIcon />
                </span>
            );
        case 'desc':
            return (
                <span className="text-grey-50 rotate-180">
                    <SortingIcon />
                </span>
            );
        default:
            return (
                <span className="text-grey-50">
                    <SortingIcon />
                </span>
            );
    }
};
export default SortIcon;
