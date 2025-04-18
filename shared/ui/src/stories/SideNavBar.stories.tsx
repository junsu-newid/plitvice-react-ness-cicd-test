import type { Meta, StoryObj } from '@storybook/react';
import { SideNavBar } from '@/components/navigation/SideNavBar.tsx';

const meta: Meta<typeof SideNavBar> = {
    title: 'Shared/SideNavBar',
    component: SideNavBar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        width: {
            control: { type: 'number' },
            description: '박스 가로 픽셀',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '240' },
            },
        },
        defaultSelected: {
            control: 'text',
            description: '초기 메뉴 값',
            table: {
                type: { summary: 'string' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof SideNavBar>;

export const Default: Story = {
    render: (args) => {
        return <SideNavBar {...args} />;
    },
    args: {
        defaultSelected: 'menu-1',
    },
};
