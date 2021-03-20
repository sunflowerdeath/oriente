import React, { useEffect } from 'react'

import Popup from './Popup'

/*
Example usage:

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

interface DropdownProps {
    closeOnEsc?: boolean
    overlay: boolean
    closeOnOverlayClick?: boolean
    closeOnOutsideClick?: boolean
}

interface DropdownRenderProps {
    ref: any
    isOpen: boolean
    open: () => void
    close: () => void
}

interface DropdownProps {
    content: (props: DropdownRenderProps) => React.ReactNode
    children: (props: DropdownRenderProps) => React.ReactNode
    placement: PopupPlacement
}

const Dropdown = (props: DropdownProps) => {
    const { placement, content, children } = props
    const [isOpen, setIsOpen] = useControlledState(false)
    return (
        <Popup
            placement={placement}
            isActive={isOpen}
            popup={() => <FocusTrap>{content()}</FocusTrap>}
        >
            {children()}
        </Popup>
    )
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
