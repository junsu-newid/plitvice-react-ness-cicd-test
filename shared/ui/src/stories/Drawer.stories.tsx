import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@/components/drawer/Drawer.tsx';

const meta: Meta<typeof Drawer> = {
    title: 'Shared/Drawer',
    component: Drawer,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        open: {
            control: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
            },
        },
        onClose: {
            control: false,
            table: {
                type: { summary: '() => void' },
            },
        },
        children: {
            control: false,
            table: {
                type: { summary: 'ReactNode' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
    render: () => (
        <Drawer open={true} onClose={() => {}}>
            <div className="p-4">
                <h2 className="text-lg font-bold">Hello from Drawer!</h2>
                <p className="mt-2 text-sm text-gray-600">This drawer is always open in this story.</p>
            </div>
        </Drawer>
    ),
};
