import type { Meta, StoryObj } from '@storybook/react';
import { TooltipBoxOnOverflow } from '@/components/textfield/TooltipBoxOnOverflow';

const meta: Meta<typeof TooltipBoxOnOverflow> = {
    title: 'Shared/TextField/TooltipBoxOnOverflow',
    component: TooltipBoxOnOverflow,
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
type Story = StoryObj<typeof TooltipBoxOnOverflow>;

export const Default: Story = {
    args: {
        displayText: '이 텍스트는 길이가 너무 길어서 미리보기 영역을 벗어나면 말줄임이 되고, hover 시 전체가 보입니다.',
        tooltipText: '이 텍스트는 길이가 너무 길어서 미리보기 영역을 벗어나면 말줄임이 되고, hover 시 전체가 보입니다.',
        className: 'line-clamp-2 w-[200px]',
        maxWidth: 280,
    },
};
