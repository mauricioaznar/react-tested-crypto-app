import React from 'react'

import './WelcomeFormInput.css'

interface WelcomeFormInputProps {
    value: string;
    onChange: (val: string) => void,
    id: string;
    label: string;
    className?: string;
    type?: 'text' | 'tel' | 'email';
}

export default function WelcomeFormInput (props: WelcomeFormInputProps) {
    const {
        value,
        onChange,
        id,
        label,
        className,
        type = 'text'
    }
        = props

    return (
        <div className={`welcome-form-input_wrapper mb-3 ${className || ''}`}>
            <label
                className={'welcome-form-input_label'}
                htmlFor={id}
            >
                { label }

            </label>
            <input
                className={'welcome-form-input_input'}
                type={type}
                data-testid={id}
                id={id}
                value={value}
                required
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}