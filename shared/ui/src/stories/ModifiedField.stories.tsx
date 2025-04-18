import type { Meta, StoryObj } from '@storybook/react';
import { ModifiedField } from '@/components/modifiedfield';

const meta: Meta<typeof ModifiedField> = {
    title: 'Shared/ModifiedField',
    component: ModifiedField,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof ModifiedField>;

export const Default: Story = {
    args: {
        width: 400,
        value: 'origin text',
    },
};
