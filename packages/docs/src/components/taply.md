---
imports:
    '{ TaplyExample }': '../examples/TaplyExample'
---

# Taply

Helper for handling mouse, touch and keyboard interactions.

## Usage

```js
import { useTaply } from 'oriente'

const Button = (props) => {
    const { tapState, render } = useTaply({
        onClick: () => alert("Click!")
    })
    return render((attrs, ref) => (
        <div style={{ background: tapState.isHovered ? "blue" : "white" }}>
            {props.children}
        </div>
    ))
}
```

## Example

```@render
<TaplyExample />
```

## Props

- onClick?: () => void
    
- tapState?: TapState

- onChangeTapState?: (tapState: TapState) => void

- onFocus?: (event: FocusEvent) => void

- onBlur?: (event: FocusEvent) => void

- isDisabled?: boolean

- preventFocusOnTap?: boolean
    default: true

- isFocusable?: boolean

- isPinchable?: boolean

- tabIndex?: number
