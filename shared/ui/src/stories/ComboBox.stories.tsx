import type { Meta, StoryObj } from '@storybook/react';
import { ComboBox } from '@/components/textfield/ComboBox.tsx';
import {
    ComboBoxStoryProps,
    commonComboBoxArgTypes,
    commonComboBoxMeta,
    commonSelectBoxArgTypes,
    commonTextFieldArgTypes,
} from '@/stories/ComboBox.stories.config.tsx';
import { defaultComboBoxOptions } from '@/stories/ComboBox.stories.config.tsx';

const sizes = ['middle', 'large'] as const;

const meta: Meta<ComboBoxStoryProps> = {
    title: 'Shared/ComboBox',
    ...commonComboBoxMeta,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        ...commonComboBoxArgTypes,
        ...commonTextFieldArgTypes,
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
        noResultMessage: {
            control: 'text',
            description: '검색 결과 없을때 카피',
            table: {
                type: { summary: 'string' },
            },
        },
        showAllOptionsOnFocus: {
            control: 'boolean',
            description: '인풋 입력값과 관계없이 모든 리스트 출력',
            table: {
                type: { summary: 'boolean' },
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
            <ComboBox value={optionList[0].value} {...props}>
                <ComboBox.List optionList={optionList} />
            </ComboBox>
        );
    },
    args: {
        size: 'middle',
        optionList: defaultComboBoxOptions,
        allowCustomValue: false,
        showAllOptionsOnFocus: true,
        labelPosition: 'outer',
    },
};
