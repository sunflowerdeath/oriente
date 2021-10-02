import { Button } from 'oriente'
import { extendComponentStyles } from 'floral'

const buttonStyles = (props, tapState) => ({
    root: {
        background: '#444',
        outline: 'none',
        boxShadow: tapState.isFocused ? '0 0 0 2px #f06292' : 'none',
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0 8px'
    }
})

const ExampleButton = extendComponentStyles(Button, buttonStyles)

export default ExampleButton
