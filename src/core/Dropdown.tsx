import React, { useEffect, useCallback } from 'react'
import FocusLock from 'react-focus-lock'
// @ts-ignore
import { useStyles } from 'floral'

import Popup from './Popup'
import { AppearAnimation, FadeAnimation } from './animations'
import useControlledState from '../utils/useControlledState'
import { FloralProps, PopupPlacement } from '../types'
import { Layer } from './layers'

/*
Example usage:

<Menu
    content={() => (
        <>
            <MenuItem>1</MenuItem>
            <MenuItem>2</MenuItem>
        </>
    }}
    onSelect={}
    closeOnSelect={}
    placement={}
>
    {({ ref, open }) => <Button ref={ref} onTap={open}>Menu</Button>}
</Menu>

<MenuList
    onSelect={}
>
    <MenuItem>1</MenuItem>
    <MenuItem>2</MenuItem>
</Menu>


<Dropdown
    render={(ref) => (
        <Menu onSelect={} ref={ref}>
            <MenuItem value="value">Item</MenuItem>
            <MenuItem value="value" isDisabled>Disabled item</MenuItem>
        </Menu>
    )}
>
    {({ open, isOpen }) => (
        <Button onTap={open}>
            <Icon />
        </Button>
    )}
</Dropdown>
*/

interface DropdownRenderProps {
    ref: any
    isOpen: boolean
    open: () => void
    close: () => void
}

interface DropdownProps extends FloralProps {
    content: (props: DropdownRenderProps) => React.ReactNode
    children: (props: DropdownRenderProps) => React.ReactNode
    placement: PopupPlacement
    Animation: AppearAnimation
    closeOnEsc?: boolean
    closeOnOverlayClick?: boolean
}

const dropdownStyles = {
    overlay: {
        background: 'rgba(0,0,0,.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    dropdown: {
        background: 'white'
    }
}

const Dropdown = (props: DropdownProps) => {
    const { placement, content, children, closeOnOverlayClick } = props
    const styles = useStyles(dropdownStyles, [props])
    const [isOpen, setIsOpen] = useControlledState(false)
    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    const renderProps = { isOpen, open, close }
    return (
        <>
            <Layer type="modal" isActive={isOpen}>
                <div
                    style={styles.overlay}
                    onClick={() => closeOnOverlayClick && setIsOpen(false)}
                />
            </Layer>
            <Popup
                placement={placement}
                isActive={isOpen}
                popup={(ref) => (
                    <FocusLock>
                        <div style={styles.dropdown} ref={ref}>
                            {content(renderProps)}
                        </div>
                    </FocusLock>
                )}
            >
                {(ref) => children(ref, renderProps)}
            </Popup>
        </>
    )
}

Dropdown.defaultProps = {
    placement: { side: 'right', align: 'start' },
    Animation: FadeAnimation
}

export default Dropdown

// focus on open
// close on blur

interface DropdownMenuProps extends DropdownProps {}

const DropdownMenu = (props: DropdownMenuProps) => {
    let menuRef = useRef()

    return (
        <Dropdown
            content={({ ref, isOpen, close }) => (
                <Menu ref={ref} onSelect={close}>
                    {content()}
                </Menu>
            )}
        >
            {children}
        </Dropdown>
    )
}
