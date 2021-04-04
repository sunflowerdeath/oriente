---
imports:
    'TooltipExample, { ControlledTooltipExample }': './TooltipExample.js'
---

# Tooltip

Tooltip appears near element when a user interacts with an element.

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

```@render
<TooltipExample showDelay={500}>show delay</TooltipExample>
<TooltipExample hideDelay={500}>hide delay</TooltipExample>
```

## Show/hide on tap

```@render
<TooltipExample showOnTap>click</TooltipExample>
```

## Controlled

```@render
<ControlledTooltipExample />
```
