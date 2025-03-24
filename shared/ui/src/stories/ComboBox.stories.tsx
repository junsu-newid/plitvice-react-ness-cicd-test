import type { Meta, StoryObj } from '@storybook/react';
import { ComboBox } from '@/components/textfield/ComboBox.tsx';

const defaultOptions = [
    { value: 'item01', label: 'Item01' },
    { value: 'item02', label: 'Item02' },
    { value: 'item03', label: 'Item03' },
];

const meta: Meta<typeof ComboBox> = {
    title: 'Shared/ComboBox',
    component: ComboBox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'radio' },
            options: ['small', 'middle', 'large'],
            description: '박스 및 폰트 사이즈',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'small' },
            },
        },
        width: {
            control: { type: 'number' },
            description: '박스 가로 픽셀',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '240' },
            },
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder',
            table: {
                type: { summary: 'string' },
            },
        },
        label: {
            control: 'text',
            description: '박스 제목',
            table: {
                type: { summary: 'string' },
            },
        },
        labelColor: {
            control: 'text',
            description: '박스 제목 색깔',
            table: {
                type: { summary: 'string' },
            },
        },
        labelPosition: {
            control: 'text',
            description: '박스 제목 위치',
            table: {
                type: { summary: 'outer | inner' },
            },
        },
        value: {
            control: 'text',
            description: '초기 세팅 값',
            table: {
                type: { summary: 'string' },
            },
        },
        noResultMessage: {
            control: 'text',
            description: '검색 결과 없을때 카피',
            table: {
                type: { summary: 'string' },
            },
        },
        onInputChange: {
            action: 'onInputChange',
            description: '텍스트 필드 값 변경 핸들러',
            table: {
                type: { summary: '(value: string) => void' },
            },
        },
        onChange: {
            action: 'onChange',
            description: '샐렉트 옵션 값 변경 리시버',
            table: {
                type: { summary: '(value: string) => void' },
            },
        },
        showAllOptionsOnFocus: {
            control: 'boolean',
            description: '인풋에 어떤 값이 들어오든 관계없이 모든 리스트 출력',
            table: {
                type: { summary: 'boolean' },
            },
        },
        allowCustomValue: {
            control: 'boolean',
            description: '인풋 포커스 아웃 시 오류값 허용 제어',
            table: {
                type: { summary: 'boolean' },
            },
        },
        readonly: {
            control: 'boolean',
            description: '인풋 수정 제어',
            table: {
                type: { summary: 'boolean' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '활성화 제어',
            table: {
                type: { summary: 'boolean' },
            },
        },
        invalid: {
            control: 'boolean',
            description: '오류 검출 및 사용 불가 제어',
            table: {
                type: { summary: 'boolean' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

// 크기 변형
export const TextField: Story = {
    render: (args) => <ComboBox {...args} />,
    args: {
        size: 'middle',
    },
};

export const ComboBox_: Story = {
    render: (args) => (
        <ComboBox {...args}>
            <ComboBox.List optionList={defaultOptions} />
        </ComboBox>
    ),
    args: {
        size: 'middle',
    },
};
