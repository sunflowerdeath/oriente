import React, {
    useState,
    createContext,
    useContext,
    useCallback,
    forwardRef
} from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'
import FocusLock from 'react-focus-lock'
import { useKey } from 'react-use'

import {
    useDescendant,
    useDescendants,
    Descendants
} from '../utils/descendants'
import {
    initialTapState,
    TapState,
    FloralProps,
    PopupPlacement
} from '../types'
import Popup from './Popup'
import useControlledState from '../utils/useControlledState'
import useAnimatedValue from '../utils/useAnimatedValue'

import { AppearAnimation, SlideAnimation } from './animations'
import { Layer } from './layers'

export interface MenuRenderProps {
    isOpen: boolean
    open: () => void
    close: () => void
}

export interface MenuProps {
    /* Content of the dropdown menu */
    menu: (props: MenuRenderProps) => React.ReactNode

    /* Trigger element that menu will be attached to */
    children: (ref: any, props: MenuRenderProps) => React.ReactNode

    /* Placement of the menu relative to the target */
    placement: PopupPlacement

    /* Function that is called when `<MenuItem>` is selected */
    onSelect?: (value?: string) => void

    /* Whether the menu should close when an item is selected */
    closeOnSelect?: boolean

    /* Component for hide and show animation */
    Animation: AppearAnimation
}

export interface MenuListProps extends FloralProps {
    children: React.ReactNode
    onFocus?: () => void
    onBlur?: () => void
    onSelect?: (value?: string) => void
    // TODO autoSelectFirstItem
}

export interface MenuItemProps {
    isDisabled?: boolean
    onSelect?: () => void
    value?: string
    children: React.ReactNode
}

interface MenuDescendantProps {
    isDisabled?: boolean
    onSelect?: () => void
    value?: string
}

interface MenuContextProps {
    descendants: Descendants<MenuDescendantProps>
    selectedIndex: number
    setSelectedIndex: (index: number) => void
    onSelect: (index: number) => void
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined)

const MenuItem = (props: MenuItemProps) => {
    const { isDisabled, onSelect, value, children } = props
    const menuContext = useContext(MenuContext)
    if (!menuContext) {
        throw new Error('MenuItem can be used only inside Menu or MenuList')
    }
    const {
        descendants,
        selectedIndex,
        setSelectedIndex,
        onSelect: menuOnSelect
    } = menuContext
    const { ref, index } = useDescendant(descendants, {
        isDisabled,
        onSelect,
        value
    })
    const isSelected = index !== -1 && index === selectedIndex
    const [tapState, setTapState] = useState(initialTapState)
    const onChangeTapState = useCallback(
        (tapState) => {
            setTapState(tapState)
            if (tapState.isHovered) setSelectedIndex(index)
        },
        [index]
    )
    const styles = useStyles(undefined, [props, { isSelected }])

    return (
        <Taply
            onChangeTapState={onChangeTapState}
            tapState={tapState}
            onTap={() => menuOnSelect(index)}
            isDisabled={isDisabled}
            isFocusable={false}
        >
            <div style={styles.root} ref={ref}>
                {children}
            </div>
        </Taply>
    )
}

const getNextIndex = (index: number, length: number) =>
    index < length - 1 ? index + 1 : 0

const getPrevIndex = (index: number, length: number) =>
    index > 0 ? index - 1 : length - 1

const menuListStyles = {
    root: { outline: 'none' }
}

const MenuList = forwardRef((props: MenuListProps, ref) => {
    const { children, onSelect } = props
    const descendants = useDescendants<MenuDescendantProps>()
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const select = useCallback(
        (index: number) => {
            let { onSelect: itemOnSelect, value } = descendants.items[
                index
            ].props
            if (itemOnSelect) itemOnSelect()
            if (onSelect && value !== undefined) onSelect(value)
        },
        [onSelect, descendants]
    )
    const context = {
        descendants,
        selectedIndex,
        setSelectedIndex,
        onSelect: select
    }
    const styles = useStyles(menuListStyles, [props])

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            const selectableDescendants = descendants.items.filter(
                (item) => !item.props.isDisabled
            )
            const selectableIndex = selectableDescendants.findIndex(
                (item) => item === descendants.items[selectedIndex]
            )
            const mapIndex = (index: number) =>
                descendants.items.findIndex(
                    (item) => item === selectableDescendants[index]
                )
            const handlers = {
                ArrowDown: () => {
                    let nextIndex = mapIndex(
                        getNextIndex(
                            selectableIndex,
                            selectableDescendants.length
                        )
                    )
                    setSelectedIndex(nextIndex)
                },
                ArrowUp: () => {
                    let prevIndex = mapIndex(
                        getPrevIndex(
                            selectableIndex,
                            selectableDescendants.length
                        )
                    )
                    setSelectedIndex(prevIndex)
                },
                Home: () => {
                    setSelectedIndex(mapIndex(0))
                },
                End: () => {
                    setSelectedIndex(mapIndex(selectableDescendants.length - 1))
                },
                Enter: () => select(selectedIndex)
            }
            const handler = handlers[event.key]
            if (handler) {
                event.preventDefault()
                handler(event)
            }
        },
        [descendants]
    )

    return (
        <div style={styles.root} onKeyDown={onKeyDown} tabIndex={0} ref={ref}>
            <MenuContext.Provider value={context}>
                {children}
            </MenuContext.Provider>
        </div>
    )
})

const menuStyles = {
    overlay: {
        background: 'transparent',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        userSelect: 'none'
    },
    list: {
        background: 'white'
    }
}

const Menu = (props: MenuProps) => {
    const {
        placement,
        menu,
        children,
        Animation,
        closeOnSelect,
        onSelect
    } = props
    const styles = useStyles(menuStyles, [props])
    const [isOpen, setIsOpen] = useControlledState(props, 'isOpen', false)
    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    useKey('Escape', close)
    const menuListOnSelect = useCallback(
        (value?: string) => {
            if (onSelect) onSelect(value)
            if (closeOnSelect) close()
        },
        [onSelect, closeOnSelect]
    )
    const [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0)
    const isActive = isOpen || !isRest
    const renderProps = { isOpen, open, close }
    return (
        <>
            <Layer type="popup" isActive={isOpen}>
                <div
                    style={styles.overlay}
                    onClick={close}
                    onDragStart={(e) => e.preventDefault()}
                />
            </Layer>
            <Popup
                placement={placement}
                isActive={isActive}
                popup={(ref) => (
                    <Animation openValue={openValue}>
                        <FocusLock>
                            <MenuList
                                style={styles.list}
                                ref={ref}
                                onSelect={menuListOnSelect}
                            >
                                {menu(renderProps)}
                            </MenuList>
                        </FocusLock>
                    </Animation>
                )}
            >
                {(ref) => children(ref, renderProps)}
            </Popup>
        </>
    )
}

Menu.defaultProps = {
    closeOnSelect: true,
    Animation: SlideAnimation
}

export { Menu, MenuList, MenuItem }
