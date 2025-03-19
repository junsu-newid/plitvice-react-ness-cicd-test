import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '@/component/textfield/TextField.tsx';
import SearchIcon from '@/asset/icSearch.svg?react';
import { theme } from '@/style/theme.ts';

const meta: Meta<typeof TextField> = {
    title: 'Shared/TextField',
    component: TextField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'radio' },
            options: ['sm', 'lg'],
            description: '텍스트 필드 크기',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'sm' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '텍스트 필드 비활성화 여부',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        invalid: {
            control: 'boolean',
            description: '텍스트 필드 유효성 여부',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
    render: (args) => (
        <TextField {...args}>
            <TextField.Input placeholder="Placeholder" />
        </TextField>
    ),
    args: {
        size: 'sm',
    },
};

export const Dimmed: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField size="sm" disabled={true}>
                <TextField.Input placeholder="Placeholder" />
            </TextField>

            <TextField size="lg" disabled={true}>
                <TextField.Input value={'Input Text'} />
            </TextField>
        </div>
    ),
};

export const WithLabel: Story = {
    render: (args) => (
        <TextField {...args}>
            <TextField.InputBox>
                <TextField.Label>Label</TextField.Label>
                <TextField.Input placeholder="Placeholder" />
            </TextField.InputBox>
        </TextField>
    ),
    args: {
        size: 'lg',
    },
};

export const WithIcon: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField size="sm">
                <TextField.Icon>
                    <SearchIcon style={{ color: theme.colors.grey50 }} />
                </TextField.Icon>
                <TextField.Input placeholder="Placeholder" />
            </TextField>

            <TextField size="lg">
                <TextField.Input placeholder="Placeholder" />
                <TextField.Icon>
                    <SearchIcon style={{ color: theme.colors.grey50 }} />
                </TextField.Icon>
            </TextField>
        </div>
    ),
};
