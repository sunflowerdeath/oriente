# Oriente

![npm](https://img.shields.io/npm/v/oriente?color=%23880e4f&style=flat-square)&nbsp;&nbsp;&nbsp;![Github](https://img.shields.io/github/lerna-json/v/sunflowerdeath/oriente?color=%23880e4f&label=github&style=flat-square)

Oriente is a React UI library.

Its goal is to provide simple, composable and customizable components.

## Install

```
npm install oriente
```

## Setup

Some components may require to be rendered inside the specific provider.
E.g. all components that use layers require `<Stack>` component,
and toasts require `<ToastContainer>`.

```js
import { Stack, ToastProvider } from 'oriente'

render(
    <Stack>
        <ToastContainer>{/* Your app */}</ToastContainer>
    </Stack>
)
```

There is more convenient solution to use single component that setups all required providers:

```js
import { OrienteProvider } from 'oriente'

render(<OrienteProvider>{/* Your app */}</OrienteProvider>)
```

## Customization

Oriente uses [Floral](https://github.com/sunflowerdeath/floral) library
for defining styles.
On each component page you can find a list of elements that can be styled.

### Styling different elements of the component

```js
const modalStyles = {
    container: {
        paddingTop: 100,
        paddingBottom: 100
    },
    overlay: {
        background: 'rgba(0,0,0,.5)',
    },
    window: {
        background: '#2c3e50',
        color: 'white',
        padding: 32
    }
}

<Modal styles={modalStyles} />
```

### Create new component with custom styles

```js
import { extendComponentStyles } from 'oriente'

const CustomModal = extendComponentStyles(Modal, modalStyles)
```

### Style component depending on its props or state

```js
const menuItemStyles = (/* props */ { isDisabled }, /* state */ { isSelected }) => ({
    root: {
        color: isDisabled ? '#999' : '#333',
        background: isSelected ? 'rgba(0,0,0,.15)' : 'transparent',
        padding: '12px 16px'
    }
})

<MenuItem styles={menuItemStyles}>...</MenuItem>
```
