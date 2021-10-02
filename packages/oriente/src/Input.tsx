import { useStyles } from 'floral'
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react'
// @ts-ignore
import Taply from 'taply'

import mergeRefs from './utils/mergeRefs'

interface BaseInputProps<T> {
    value: T
    onChange?: (value: T) => void
    isDisabled?: boolean
    onFocus?: () => void
    onBlur?: () => void
}

export interface TextInputProps extends BaseInputProps<string> {
    isWide?: boolean
    isMultiline?: boolean
    rows: number
    maxRows: number
    as: any
    children?: React.ReactNode
}

const textInputStyles = (props: TextInputProps, isFocused: boolean) => {
    const root: React.CSSProperties = { display: 'grid' }
    if (props.isWide) root.width = '100%'

    const input: React.CSSProperties = {
        background: 'transparent',
        margin: 0,
        border: 'none',
        borderRadius: 0,
        color: 'inherit',
        font: 'inherit',
        gridArea: '1 / 1 / 2 / 2',
        width: '100%',
        boxSizing: 'border-box',
        resize: 'none',
        cursor: props.isDisabled ? 'not-allowed' : 'text'
    }

    const lineHeight = 1.5
    const { rows, maxRows } = props
    const replica: React.CSSProperties = {
        font: 'inherit',
        whiteSpace: 'pre-wrap',
        visibility: 'hidden',
        gridArea: '1 / 1 / 2 / 2'
    }
    if (rows) replica.minHeight = `${rows * lineHeight}rem`
    if (maxRows) replica.maxHeight = `${maxRows * lineHeight}rem`

    return { root, input, replica }
}

const TextInput = forwardRef((props: TextInputProps, ref) => {
    const {
        as,
        value,
        onChange,
        isDisabled,
        onFocus,
        onBlur,
        isMultiline,
        rows,
        maxRows,
        isWide,
        ...restProps
    } = props
    const [isFocused, setIsFocused] = useState(false)
    const styles = useStyles(textInputStyles, [props, isFocused])

    const inputRef = useRef()
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), [])

    const elem = as || (isMultiline ? 'textarea' : 'input')
    const elemProps = {
        ref: mergeRefs(inputRef, ref),
        value,
        onChange: (e) => onChange && onChange(e.target.value),
        disabled: isDisabled,
        onFocus: () => {
            setIsFocused(true)
            if (onFocus) onFocus()
        },
        onBlur: () => {
            setIsFocused(false)
            if (onBlur) onBlur()
        },
        ...restProps, // TODO omit styles
        style: styles.input
    }
    return (
        <div style={styles.root}>
            {React.createElement(elem, elemProps)}
            {isMultiline && <div style={styles.replica}>{value} </div>}
        </div>
    )
})

TextInput.defaultProps = {
    value: ''
}

interface TextInputGroupProps {
    children: React.ReactNode
    right: React.ReactNode
    left: React.ReactNode
}

const TextInputGroup = (props: TextInputGroupProps) => {
    const { right, left, children } = props
    const styles = useStyles(undefined, [props])
    return (
        <div style={styles.root}>
            {children}
            {right && <div style={styles.right}>{right}</div>}
            {left && <div style={styles.left}>{left}</div>}
        </div>
    )
}

export interface SwitchProps extends BaseInputProps<boolean> {
    label: React.ReactNode
}

const switchStyles = (props: SwitchProps, tapState: any) => {
    const root = {
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none'
    }
    const toggle: React.CSSProperties = {
        position: 'relative',
        height: '1rem',
        width: '2rem',
        marginRight: '.5rem',
        borderRadius: '.5rem',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center'
    }
    const bar = {
        width: '100%',
        height: '.75rem',
        borderRadius: '.375rem',
        transition: 'background .15s ease-in-out'
    }
    const marker = {
        position: 'absolute',
        top: 0,
        left: props.value ? '1rem' : 0,
        width: '1rem',
        height: '1rem',
        borderRadius: '50%',
        transition: 'left .15s ease-in-out',
        boxShadow: '0px 0px 0px 1px rgba(0,0,0,.25)'
    }
    if (props.isDisabled) {
        root.cursor = 'not-allowed'
    }

    return { root, toggle, bar, marker }
}

const Switch = (props: SwitchProps) => {
    let { value, onChange, label, isDisabled } = props
    let [tapState, setTapState] = useState({})
    let styles = useStyles(switchStyles, [props, tapState])
    return (
        <Taply
            onChangeTapState={setTapState}
            onTap={() => onChange && onChange(!value)}
            isDisabled={isDisabled}
        >
            <div style={styles.root}>
                <div style={styles.toggle}>
                    <div style={styles.bar} />
                    <div style={styles.marker} />
                </div>
                <div style={styles.label}>{label}</div>
            </div>
        </Taply>
    )
}

interface CheckboxProps extends BaseInputProps<boolean> {
    isIndeterminate?: boolean
    label?: React.ReactNode
}

const checkboxStyles = (props: CheckboxProps) => {
    const root = {
        display: 'flex',
        alignItems: 'center'
    }
    const icon = {
        border: '1px solid #ccc',
        borderRadius: 3,
        marginRight: '.25rem'
    }
    return { root, icon }
}

const Checkbox = (props: CheckboxProps) => {
    const styles = useStyles(checkboxStyles, [props])
    const { label } = props
    return (
        <div style={styles.root}>
            <div style={styles.icon} />
            {label}
        </div>
    )
}

interface RadioGroupProps extends BaseInputProps<string> {
    children: React.ReactNode
}

interface RadioButtonProps {
    isDisabled: boolean
    label: React.ReactNode
    value: string
}

const RadioGroup = (props: RadioGroupProps) => {
    const { children } = props
    const styles = useStyles(null, [props])
    // const
    return <div style={styles.root}>{children}</div>
}

const RadioButton = (props: RadioButtonProps) => {
    const { label } = props
    const styles = useStyles(null, [props])
    // const
    return (
        <div style={styles.root}>
            <div style={styles.icon} />
            <div style={styles.label}>{label}</div>
        </div>
    )
}

interface SelectProps {}

export { TextInput, TextInputGroup, Switch, Checkbox, RadioGroup, RadioButton }
