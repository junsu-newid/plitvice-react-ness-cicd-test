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
        return (
            <SideNavBar {...args}>
                <SideNavBar.Item id={'menu-1'} label={'menu 1'} />
                <SideNavBar.Item id={'menu-2'} label={'menu 2'}>
                    <SideNavBar.DropdownItem id={'drop-1'} label={'drop 1'} />
                    <SideNavBar.DropdownItem id={'drop-2'} label={'drop 2'} />
                    <SideNavBar.DropdownItem id={'drop-3'} label={'drop 3'} />
                </SideNavBar.Item>
                <SideNavBar.Item id={'menu-3'} label={'menu 3'} />
                <SideNavBar.Item id={'menu-4'} label={'menu 4'} />
            </SideNavBar>
        );
    },
    args: {
        defaultSelected: 'menu-1',
    },
};
