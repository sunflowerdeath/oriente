---
imports:
    '{ ModalExample, ModalAnimationExample }': '../examples/ModalExample'
---

# Modal

Modal displays content in the window above the page.

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

## Modal Props

```@propsdoc
file: ../../../oriente/src/modal.tsx
allowMarkdown: true
component: Modal
```

## ModalCloseButton Props

```-@propsdoc
file: ../../../oriente/src/modal.tsx
allowMarkdown: true
component: ModalCloseButton
```
