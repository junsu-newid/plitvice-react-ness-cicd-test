import type { Meta, StoryObj } from '@storybook/react';
import { TooltipBox } from '@/components/textfield/TooltipBox.tsx';

const meta: Meta<typeof TooltipBox> = {
    title: 'Shared/TextField/TooltipBox',
    component: TooltipBox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        displayText: {
            control: 'text',
            description: '화면에 표시할 텍스트',
        },
        tooltipText: {
            control: 'text',
            description: '툴팁에 표시할 텍스트',
        },
        className: {
            control: 'text',
            description: '텍스트 박스 스타일',
        },
        maxWidth: {
            control: 'number',
            description: '툴팁 최대 너비(px), 기본 280',
        },
    },
};

export default meta;
type Story = StoryObj<typeof TooltipBox>;

export const Default: Story = {
    args: {
        displayText: 'Show',
        tooltipText: 'Display row on/off',
        className: 'line-clamp-2 w-[200px]',
        maxWidth: 280,
    },
};
