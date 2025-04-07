import React, { forwardRef } from 'react';
import useTextField from '@/components/input/hooks.ts';

// FIXME : - 경우에 따라 키이벤트 처리 달라질 수 있음
// FIXME : - 최소 키이벤트 등록 대신 해주기
// FIXME : - className 넘겨 받을 수 있게(사용하는 방법에 따라 hover시 보더가 보이고 기본으로 안보이는 등의 커스텀이 들어갈 수 있다)
// FIXME : - Enter시에만 최종 값이 바뀌어야할 수도, 입력시 바로 최종 값에 반영되어야할 수도
// FIXME : - Escape, blur시에 원래값으로 되돌리기
// FIXME : - Size는 ?
// FIXME : - error상황등에 따라 border 색상 변경 필요할수도
// FIXME : - MaxLength 지정 등
// FIXME : - varient로 borderless 구분 ? (outlined(default) | borderless | filled 등)
// FIXME : - type도 지정할 수 있어야함 패스워드같은거
// FIXME : - 유효성 검사 체크해서 onChange에 값을 변경할수도 있음(실시간 확인하며 text color를 바꿀수도)

// FIXME : - 1. 단일 버전

// boolean vs handler props

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onInputChange?: (value: string) => void;
    onEnter?: (value: string) => void;
    resetOnEscape?: boolean;
    updateOnBlur?: boolean;
    className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            value: externalValue,
            defaultValue,
            onChange,
            onInputChange,
            onEnter,
            resetOnEscape,
            updateOnBlur,
            className = '',
            ...props
        },
        ref,
    ) => {
        const { inputRef, handleInputFocus, handleKeyDown, value, handleChange } = useTextField({
            initialValue: externalValue || defaultValue,
            onChange,
            onInputChange,
            onEnter,
            resetOnEscape,
            updateOnBlur,
        });

        const combinedRef = (node: HTMLInputElement) => {
            inputRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        return (
            <input
                ref={combinedRef}
                className={`placeholder:text-grey-40 ${className}`}
                value={value}
                onChange={handleChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                {...props}
            />
        );
    },
);

Input.displayName = 'Input';

export default Input;
