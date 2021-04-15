---
imports:
    '{ ModalExample, ModalAnimationExample }': './ModalExample'
---

# Modal

Modal

## Example

```@render
<ModalExample>
    {(close) =>
        <>
            Modal
            <br />
            <br />
            <button onClick={close}>
                Close modal
            </button>
        </>
    }
</ModalExample>
```

## Scroll

```@render
<ModalExample>
    {(close) => Array(50).fill(1).map(() => <>
        Modal
        <br />
        <br />
    </>)}
</ModalExample>
```

## Animation

```@render
<ModalAnimationExample />
```

## Props

```
#@propsdoc
file: ../../core/Modal.tsx
allowMarkdown: true
component: Modal
```

```
#@propsdoc
file: ../../core/Menu.tsx
allowMarkdown: true
component: ModalCloseButton
```
