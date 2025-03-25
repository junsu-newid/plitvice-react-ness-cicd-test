import { ComboBox } from '@/components/textfield/ComboBox.tsx';
import { theme } from '@/styles/theme.ts';
import { ArgTypes } from '@storybook/react';
import { ComboBoxProps } from '@/components/textfield/ComboBox.types.ts';

export const defaultComboBoxOptions = [
    { value: 'item01', label: 'Item01' },
    { value: 'item02', label: 'Item02' },
    { value: 'item03', label: 'Item03' },
];

export const commonComboBoxMeta = {
    component: ComboBox,
};

export type ComboBoxStoryProps = ComboBoxProps & {
    optionList?: Array<{ value: string; label: string }>;
};
type ComboBoxStoryKey = keyof ComboBoxStoryProps;

export const commonIncludedControls = [
    'size',
    'width',
    'label',
    'labelColor',
    'labelPosition',
    'value',
    'disabled',
] as const satisfies readonly ComboBoxStoryKey[];

export const commonComboBoxArgTypes: ArgTypes<Pick<ComboBoxStoryProps, (typeof commonIncludedControls)[number]>> = {
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
    label: {
        control: 'text',
        description: '박스 제목',
        table: {
            type: { summary: 'string' },
        },
    },
    labelColor: {
        control: 'color',
        description: '박스 제목 색깔',
        table: {
            type: { summary: 'string' },
            defaultValue: { summary: theme.colors.grey70 },
        },
    },
    labelPosition: {
        control: { type: 'radio' },
        options: ['outer', 'inner'],
        description: '박스 제목 위치',
        table: {
            type: { summary: 'string' },
            defaultValue: { summary: 'outer' },
        },
    },
    value: {
        control: 'text',
        description: '초기 세팅 값',
        table: {
            type: { summary: 'string' },
        },
    },
    disabled: {
        control: 'boolean',
        description: '활성화 제어',
        table: {
            type: { summary: 'boolean' },
        },
    },
};

export const commonTextFieldControls = [
    ...commonIncludedControls,
    'placeholder',
    'allowCustomValue',
    'readonly',
    'invalid',
    'onInputChange',
] as const satisfies readonly ComboBoxStoryKey[];

export const commonTextFieldArgTypes: ArgTypes<Pick<ComboBoxStoryProps, (typeof commonTextFieldControls)[number]>> = {
    ...commonComboBoxArgTypes,
    placeholder: {
        control: 'text',
        description: 'Placeholder',
        table: {
            type: { summary: 'string' },
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
    invalid: {
        control: 'boolean',
        description: '오류 검출 및 사용 불가 제어',
        table: {
            type: { summary: 'boolean' },
        },
    },
    onInputChange: {
        action: 'onInputChange',
        description: '텍스트 필드 값 변경 핸들러',
        table: {
            type: { summary: '(value: string) => void' },
        },
    },
};

export const commonSelectBoxControls = [
    ...commonIncludedControls,
    'optionList',
    'onChange',
] as const satisfies readonly ComboBoxStoryKey[];

export const commonSelectBoxArgTypes: ArgTypes<Pick<ComboBoxStoryProps, (typeof commonSelectBoxControls)[number]>> = {
    ...commonComboBoxArgTypes,
    optionList: {
        control: 'object',
        description: '리스트 옵션',
    },
    onChange: {
        action: 'onChange',
        description: '샐렉트 옵션 값 변경 리시버',
        table: {
            type: { summary: '(value: string) => void' },
        },
    },
};
