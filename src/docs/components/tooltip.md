---
imports:
    '{ TooltipExample, ControlledTooltipExample }': './TooltipExample.js'
    '{ TooltipArrow }': '../../core/Tooltip.tsx'
---

# Tooltip

Tooltip appears near element when a user interacts with an element.

## Usage

```js
import { Tooltip } from 'oriente'

<Tooltip tooltip="Content of the Tooltip">
    <Button>Hover me to show tooltip</Button>
</Tooltip>
```

## Example

```@render
<TooltipExample />
```

## Placement

```@render
<TooltipExample>top (default)</TooltipExample>
<TooltipExample placement={{ side: 'bottom', align: 'center', offset: 8 }}>bottom</TooltipExample>
```

## Arrow

```@render
<TooltipExample
    tooltip={
        <>
            <TooltipArrow color="#8e44ad" />
            Tooltip with arrow
        </>
    }
/>
```

```jsx
<Tooltip
    tooltip={
        <>
            <TooltipArrow color="#8e44ad" />
            Tooltip with arrow
        </>
    }
>
    ...
</Tooltip>
```

## Delay

```@render
<TooltipExample showDelay={500}>show delay</TooltipExample>
<TooltipExample hideDelay={500}>hide delay</TooltipExample>
```

```jsx
<Tooltip ... showDelay={500}>...</Tooltip>

<Tooltip ... hideDelay={500}>...</Tooltip>
```

## Show/hide on tap

```@render
<TooltipExample showOnTap>click</TooltipExample>
```

```jsx
<Tooltip ... showOnTap={true}>...</Tooltip>
```

## Controlled

```@render
<ControlledTooltipExample />
```

```jsx
<Tooltip ... isOpen={isOpen} onChangeIsOpen={(value) => setIsOpen(value)}>...</Tooltip>
```

## Tooltip Props

```@propsdoc
file: ../../core/Tooltip.tsx
allowMarkdown: true
component: Tooltip
```

## TooltipArrow Props

```@propsdoc
file: ../../core/Tooltip.tsx
allowMarkdown: true
component: TooltipArrow
```
