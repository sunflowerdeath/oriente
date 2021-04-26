import React, {
    forwardRef,
    useState,
    useEffect,
    useImperativeHandle,
    useRef
} from 'react'
import { useStyles } from 'floral'

let getRowsNumber = (value, rows, maxRows) => {
    let matches = value.match(/\n/g)
    let lines = matches ? matches.length + 1 : 1
    let res = Math.max(rows, lines)
    if (maxRows !== undefined) res = Math.min(res, maxRows)
    return res
}

const inputStyles = (props, isFocused) => {
    let root = {}
    if (props.isWide) root.width = '100%'
    return { root }
}

const TextInput = forwardRef((props, ref) => {
    let {
        as,
        value,
        children,
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
    let [isFocused, setIsFocused] = useState(false)
    let styles = useStyles(inputStyles, [props, isFocused])

    let [currentRows, setCurrentRows] = useState(getRowsNumber(value, rows, maxRows))
    useEffect(() => {
        setCurrentRows(getRowsNumber(value, rows, maxRows))
    }, [value, rows, maxRows])

    let inputRef = useRef()
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }), [])

    let elem = as || (isMultiline ? 'textarea' : 'input')
    let elemProps = {
        ref: inputRef,
        value,
        onChange: (e) => onChange(e.target.value),
        disabled: isDisabled,
        onFocus: () => {
            setIsFocused(true)
            if (onFocus) onFocus()
        },
        onBlur: () => {
            setIsFocused(false)
            if (onBlur) onBlur()
        },
        rows: currentRows,
        ...restProps,
        style: styles.input
    }
    return React.createElement(elem, elemProps)
})

/*
Input.propTypes = {
  children?: React.ReactNode
  onChange: (value: string) => void
  isInvalid?: boolean
  isDisabled?: boolean
  onFocus?: () => void
  onBlur?: () => void
  isMultiline?: boolean
  rows?: number
  maxRows?: number
  isWide?: boolean
}
*/

TextInput.defaultProps = {
    value: '',
    rows: 1
}

export default TextInput

const InputGroup = (props) => {
    let { right, left, children } = props
    let styles = useStyles(null, [props])
    return (
        <div style={styles.root}>
            {children}
            {right && <div style={styles.right}>{right}</div>}
            {left && <div style={styles.left}>{left}</div>}
        </div>
    )
}

const Test = () => {
    return (
        <>
            <Field field={form.fields.name}>
                {({ error, ...inputProps }) => (
                    <FormRow label={label} error={error}>
                        <TextInput {...inputProps} left={<SearchIcon />} />
                    </FormRow>
                )}
            </Field>
            <Field field={form.fields.name}>
                {({ error, ...inputProps }) => (
                    <FormRow label="Чёто" error={error}>
                        <SelectInput {...inputProps} />
                    </FormRow>
                )}
            </Field>
        </>
    )
}
