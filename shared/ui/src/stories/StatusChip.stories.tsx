import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatusChip, StatusChipProps } from '@/components/chips/StatusChip';

const colorOptions: StatusChipProps['color'][] = [
    'red',
    'orange',
    'yellow',
    'lime',
    'green',
    'cyan',
    'blue',
    'violet',
    'fuchsia',
    'pink',
    'gray',
];

type StoryArgProps = StatusChipProps;

const DEFAULT_ARGS: StoryArgProps = {
    color: 'red',
    children: 'Chips',
};

const meta: Meta<typeof StatusChip> = {
    title: 'Shared/Chips/StatusChip',
    component: StatusChip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        color: {
            control: { type: 'radio' },
            options: colorOptions,
            description: '표시할 색상 키',
            table: {
                type: { summary: colorOptions.join(' | ') },
                defaultValue: { summary: 'red' },
            },
        },
        children: {
            control: 'text',
            description: '칩 내부에 들어갈 텍스트',
            table: {
                type: { summary: 'ReactNode' },
                defaultValue: { summary: "'' (빈 문자열)" },
            },
        },
    },
};

export default meta;

type Story = StoryObj<StoryArgProps>;

export const Default: Story = {
    args: DEFAULT_ARGS,
    render: ({ ...args }) => <StatusChip {...args} />,
};
