import React from 'react'

import Popup from './Popup'

const FocusTrap = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
)

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
