---
imports:
    'TooltipExample, { ControlledTooltipExample }': './TooltipExample.js'
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

## Delay

```js
<Tooltip ... showDelay={500}>...</Tooltip>

<Tooltip ... hideDelay={500}>...</Tooltip>
```

```@render
<TooltipExample showDelay={500}>show delay</TooltipExample>
<TooltipExample hideDelay={500}>hide delay</TooltipExample>
```

## Show/hide on tap

```js
<Tooltip ... showOnTap={true}>...</Tooltip>
```

```@render
<TooltipExample showOnTap>click</TooltipExample>
```

## Controlled

```js
<Tooltip ... isOpen={isOpen} onChangeIsOpen={(value) => setIsOpen(value)}>...</Tooltip>
```

```@render
<ControlledTooltipExample />
```

## Props

```@propsdoc
file: ../../core/Tooltip.tsx
allowMarkdown: true
```
