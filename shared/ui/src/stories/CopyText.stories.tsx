import type { Meta, StoryObj } from '@storybook/react';
import { CopyText } from '@/components/copytext';

const meta: Meta<typeof CopyText> = {
    title: 'Shared/CopyText',
    component: CopyText,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof CopyText>;

export const Default: Story = {
    args: {
        value: '클릭해서 복사할 텍스트',
    },
};
