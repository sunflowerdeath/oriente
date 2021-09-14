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

interface BaseInputProps<T = string> {
    value: T
    onChange?: (value: T) => void
    isDisabled?: boolean
    onFocus?: () => void
    onBlur?: () => void
}

export interface TextInputProps extends BaseInputProps {
    isWide?: boolean
    isMultiline?: boolean
    lines: number
    maxLines: number
    as: any
}

const getLinesNumber = (value: string, lines: number, maxLines: number) => {
    const matches = value.match(/\n/g)
    const valueLines = matches ? matches.length + 1 : 1
    return Math.min(Math.max(lines, valueLines), maxLines)
}

const textInputStyles = (props: TextInputProps, isFocused: boolean) => {
    const root: React.CSSProperties = {}
    if (props.isWide) root.width = '100%'
    return { root }
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
        lines,
        maxLines,
        isWide,
        ...restProps
    } = props
    const [isFocused, setIsFocused] = useState(false)
    const styles = useStyles(textInputStyles, [props, isFocused])

    const [currentLines, setCurrentLines] = useState(
        getLinesNumber(value, lines, maxLines)
    )
    useEffect(() => {
        setCurrentLines(getLinesNumber(value, lines, maxLines))
    }, [value, lines, maxLines])

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
        rows: currentLines,
        ...restProps, // TODO omit styles
        style: styles.root
    }
    return React.createElement(elem, elemProps)
})

TextInput.defaultProps = {
    value: '',
    lines: 1
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

interface CheckboxProps {
    label: React.ReactNode
    isIndeterminate?: boolean
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

interface CheckboxProps extends BaseInputProps {
    isIndeterminate?: boolean
    label?: React.ReactNode
}

const checkboxStyles = (props: CheckboxProps) => {
    const root = {
        display: 'flex',
        alignItems: 'center'
    }
    const box = {
        border: '1px solid #ccc',
        borderRadius: 3,
        marginRight: '.25rem'
    }
    return { root, box }
}

const Checkbox = (props: CheckboxProps) => {
    const styles = useStyles(checkboxStyles, [props])
    const { label } = props
    return (
        <div style={styles.root}>
            <div style={styles.box} />
            {label}
        </div>
    )
}

interface RadioGroupProps {
    children: React.ReactNode
}

interface RadioButtonProps {
    label: React.ReactNode
}

interface SelectProps {}

export { TextInput, TextInputGroup, Switch }
