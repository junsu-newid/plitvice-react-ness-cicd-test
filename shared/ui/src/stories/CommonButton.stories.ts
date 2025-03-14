import type { Meta, StoryObj } from '@storybook/react';
import { CommonButton } from '@/component/button/CommonButton.tsx';

const meta: Meta<typeof CommonButton> = {
    title: 'Shared/CommonButton',
    component: CommonButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'radio' },
            options: ['sm', 'md', 'lg'],
            description: '버튼 크기',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'md' },
            },
        },
        variant: {
            control: { type: 'radio' },
            options: ['fill', 'stroke'],
            description: '버튼 스타일',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'fill' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '버튼 비활성화 여부',
            table: {
                type: { summary: 'boolean' },
            },
        },
        onClick: {
            action: 'clicked',
            description: '클릭 이벤트 핸들러',
            table: {
                type: { summary: '() => void' },
            },
        },
        children: {
            control: 'text',
            description: '버튼 내용',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof CommonButton>;

// 크기 변형
export const Default: Story = {
    args: {
        variant: 'fill',
        size: 'md',
        children: 'Button',
    },
};

export const Small: Story = {
    args: {
        ...Default,
        size: 'sm',
        children: 'Small',
        variant: 'stroke',
    },
};

export const Medium: Story = {
    args: {
        ...Default,
        size: 'md',
        children: 'Medium',
        disabled: true,
    },
};

export const Large: Story = {
    args: {
        ...Default,
        size: 'lg',
        children: 'Large',
    },
};
