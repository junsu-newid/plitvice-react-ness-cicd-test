import type { Meta, StoryObj } from '@storybook/react';
import { ComboBox } from '@/components/textfield/ComboBox.tsx';
import {
    ComboBoxStoryProps,
    commonComboBoxMeta,
    commonSelectBoxArgTypes,
    commonSelectBoxControls,
} from '@/stories/ComboBox.stories.config.tsx';
import { defaultComboBoxOptions } from '@/stories/ComboBox.stories.config.tsx';

const sizes = ['small', 'middle'] as const;

const meta: Meta<ComboBoxStoryProps> = {
    title: 'Shared/SelectBox',
    ...commonComboBoxMeta,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        controls: {
            include: commonSelectBoxControls,
        },
    },
    argTypes: {
        ...commonSelectBoxArgTypes,
        size: {
            control: { type: 'radio' },
            options: sizes,
            description: '박스 및 폰트 사이즈',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: sizes[0] },
            },
        },
    },
};

export default meta;
type Story = StoryObj<ComboBoxStoryProps>;

export const Default: Story = {
    render: (args) => {
        const { optionList = defaultComboBoxOptions, ...props } = args;

        return (
            <ComboBox {...props}>
                <ComboBox.List optionList={optionList} />
            </ComboBox>
        );
    },
    args: {
        size: 'small',
        value: defaultComboBoxOptions[0].value,
        readonly: true,
        optionList: defaultComboBoxOptions,
        labelPosition: 'outer',
    },
};
