import React, { useState } from 'react'

import { TextInput, TextInputProps, Switch, SwitchProps } from 'oriente'

const styles = (props: TextInputProps) => {
    const input = {
        background: '#444',
        color: 'white',
        padding: 8
    }
    const replica = {
        padding: 8
    }
    return { input, replica }
}

const TextInputExample = (props: TextInputProps) => {
    const [value, setValue] = useState('')
    return <TextInput value={value} onChange={setValue} styles={styles} {...props} />
}

const switchStyles = (props: SwitchProps, tapState: any) => ({
    bar: {
        background: props.isDisabled ? '#666' : props.value ? 'cornflowerblue' : '#aaa'
    },
    marker: {
        background: 'white',
        transition: 'box-shadow .15s ease-in-out, left .15s ease-in-out',
        boxShadow:
            tapState.isFocused || tapState.isHovered
                ? '0 0 0 .375rem rgba(255,255,255,.375)'
                : 'none'
    },
    label: {
        color: props.isDisabled ? '#666' : 'auto'
    }
})

const SwitchExample = (props: SwitchProps) => {
    const [value, setValue] = useState(false)
    return <Switch value={value} onChange={setValue} styles={switchStyles} {...props} />
}

export { TextInputExample, SwitchExample }
