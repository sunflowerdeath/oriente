---
imports:
    '{ Flex }': 'oriente'
---

# Flex

Flex is a helper for creating flexbox layouts with gaps between elements.

## Usage

```js
import { Flex } from 'oriente'

<Flex gap="1rem" align="center">
    ...
</Flex>
```

## Example

Row

```@render
<Flex gap="1rem">
    <div style={{ width: 20, height: 20, background: '#d35400' }} />
    <div style={{ width: 20, height: 20, background: '#d35400' }} />
    <div style={{ width: 20, height: 20, background: '#d35400' }} />
</Flex>
```

Col

```@render
<Flex dir="col" gap="1rem">
    <div style={{ width: 20, height: 20, background: '#d35400' }} />
    <div style={{ width: 20, height: 20, background: '#d35400' }} />
    <div style={{ width: 20, height: 20, background: '#d35400' }} />
</Flex>
```

## Props

```@propsdoc
file: ../../../oriente/src/flex.tsx
allowMarkdown: true
component: Flex
```
