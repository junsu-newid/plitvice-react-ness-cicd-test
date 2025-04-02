import type { Meta, StoryObj } from '@storybook/react';
import {
    ComboBoxStoryProps,
    commonComboBoxMeta,
    commonTextFieldArgTypes,
    commonTextFieldControls,
} from '@/stories/ComboBox.stories.config.tsx';

const sizes = ['middle', 'large'] as const;

const meta: Meta<ComboBoxStoryProps> = {
    title: 'Shared/TextField',
    ...commonComboBoxMeta,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        controls: {
            include: commonTextFieldControls,
        },
    },
    argTypes: {
        ...commonTextFieldArgTypes,
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
    args: {
        size: 'middle',
        allowCustomValue: true,
        labelPosition: 'outer',
    },
};
