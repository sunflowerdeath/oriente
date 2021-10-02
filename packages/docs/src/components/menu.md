---
imports:
    '{ MenuListExample, MenuExample, ScrollMenuExample, MatchWidthExample }': '../examples/MenuExample'
---

# Menu

Menu is a list of items that can be navigated using keyboard.

## Usage

```js
import { Menu } from 'oriente'

<Menu
    onSelect={(value) => console.log(`Selected: ${value}`)}
    menu={() => (
        <>
            <MenuItem value="one">First item</MenuItem>
            <MenuItem value="one" isDisabled={true}>Disabled item</MenuItem>
        </>
    )}
>
    {(ref, { open }) => (
        <Button ref={ref} onClick={open}>Open menu</Button>
    )}
</Menu>
```

## Example

```@render
<MenuExample />
```

## Scroll

Menu automatically constrains its height when it does not fit into the viewport.
Also, you can set your own `maxHeight` for the menu.

```@render
<ScrollMenuExample />
```

## Match width

If `true`, menu width will match the width of the button element.

```@render
<MatchWidthExample />
```

## Menu Props

```@propsdoc
file: ../../../oriente/src/menu.tsx
allowMarkdown: true
component: Menu
```

## MenuItem Props

```@propsdoc
file: ../../../oriente/src/menu.tsx
allowMarkdown: true
component: MenuItem
```
