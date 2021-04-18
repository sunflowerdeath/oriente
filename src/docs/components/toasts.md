---
imports:
    '{ ToastExample, ToastPlacementExample }': './ToastExample'
---

# Toasts

Toasts display small messages on top of the page for the short time.

## Usage

```js
import { useToast, ToastContainer, ToastCloseButton } from 'oriente'

const toast = useToast()
toast.show({
    children: (
        <>
            Toast
            <ToastCloseButton style={{ ... }} />
        </>
    ),
    style: { ... },
    duration: 3000,
})
```

## Example

```@render
<ToastExample />
```

## Placement

```@render
<ToastPlacementExample />
```

## Props

**useToast()**

React hook that returns `ToastController`.
This hook should be called inside `<ToastContainer>` component.

**`ToastController.show(options: ToastOptions)`**

Shows a toast. Returns id of the toast.

-   **children** `React.ReactNode` - Content of the toast.
-   **duration** `number` - Duration of the toast in ms.
-   **placement** `PopupPlacement` - Placement of the toast.
-   **onClose** `() => void` - Function that is called when the toast closes.

**`ToastController.close(id: number)`**

Hides the toast.
