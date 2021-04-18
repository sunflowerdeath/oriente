---
imports:
    '{ MenuListExample, MenuExample }': './MenuExample'
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

## Menu Props

```@propsdoc
file: ../../core/Menu.tsx
allowMarkdown: true
component: Menu
```

## MenuItem Props

```@propsdoc
file: ../../core/Menu.tsx
allowMarkdown: true
component: MenuItem
```
