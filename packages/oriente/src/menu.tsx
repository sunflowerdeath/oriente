import React, {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    useLayoutEffect
} from 'react'
import { FloralProps, FloralStyles, useStyles } from 'floral'
import FocusLock from 'react-focus-lock'
import { SpringConfig } from 'react-spring'
import { useKey, useMeasure } from 'react-use'
// @ts-ignore
import Taply from 'taply'

import { AppearAnimation, SlideAnimation } from './animations'
import { Layer } from './layers'
import { Popup } from './popup'
import {
    defaultPlacement,
    oppositeSides,
    PopupPlacement,
    PopupSide
} from './PopupController'
import { initialTapState } from './types'
import { DescendantsManager, useDescendant, useDescendants } from './utils/descendants'
import mergeRefs from './utils/mergeRefs'
import configs from './utils/springConfigs'
import useAnimatedValue from './utils/useAnimatedValue'
import useControlledState from './utils/useControlledState'
import useViewport from './utils/useViewport'

export interface MenuProps extends FloralProps<MenuProps> {
    /** Content of the dropdown menu */
    menu: (props: MenuRenderProps) => React.ReactNode

    /** Trigger element that menu will be attached to */
    children: (ref: any, props: MenuRenderProps) => React.ReactNode

    /** Placement of the menu relative to the target */
    placement?: Partial<PopupPlacement>

    /** Function that is called when `<MenuItem>` is selected */
    onSelect?: (value?: string) => void

    /** Whether the menu should close when an item is selected */
    closeOnSelect?: boolean

    /** Component for hide and show animation */
    Animation: AppearAnimation

    /** Maximum height of the list, in px. */
    maxHeight?: number

    /** Config for `react-spring` animation */
    springConfig?: SpringConfig

    /** Select first item on open */
    autoSelectFirstItem?: boolean

    /** Matches width of menu and trigger element */
    matchWidth?: boolean
}

export interface MenuListProps extends FloralProps<MenuListProps> {
    children: React.ReactNode
    onFocus?: () => void
    onBlur?: () => void
    onClose: () => void
    onSelect?: (value?: string) => void
    autoSelectFirstItem: boolean
    closeOnSelect?: boolean
}

export interface MenuItemProps extends FloralProps<MenuItemProps> {
    /** Value of the item that will be passed to the `onSelect()` handler of the Menu */
    value?: string

    /**
     * Handler that is called when the item is selected by clicking on it or pressing
     * `Enter` key
     */
    onSelect?: () => void

    isDisabled?: boolean
    onHover?: () => void
    onBlur?: () => void
    children: React.ReactNode | ((isSelected: boolean) => React.ReactNode)
}

interface MenuDescendantProps {
    isDisabled?: boolean
    onSelect?: () => void
    value?: string
}

interface MenuContextProps {
    descendants: DescendantsManager<MenuDescendantProps>
    selectedIndex: number
    setSelectedIndex: (index: number) => void
    onSelect: (index: number) => void
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined)

const MenuItem = forwardRef((props: MenuItemProps, ref) => {
    const { isDisabled, onSelect, value, children, onHover, onBlur } = props
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
    const { ref: descendantRef, index } = useDescendant(descendants, {
        isDisabled,
        onSelect,
        value
    })
    const isSelected = index !== -1 && index === selectedIndex
    useEffect(() => {
        if (isSelected) {
            if (onHover) onHover()
        } else {
            if (onBlur) onBlur()
        }
    }, [isSelected])
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
            shouldSetAttributes={false}
        >
            <div style={styles.root} ref={mergeRefs(ref, descendantRef)}>
                {typeof children === 'function' ? children(isSelected) : children}
            </div>
        </Taply>
    )
})

const getNextIndex = (index: number, length: number) =>
    index < length - 1 ? index + 1 : 0

const getPrevIndex = (index: number, length: number) =>
    index > 0 ? index - 1 : length - 1

const menuListStyles = {
    root: { outline: 'none' }
}

const scrollIntoView = (item: HTMLElement) => {
    const container = item.parentElement!
    const itemRect = item.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const scrollTop = container.scrollTop
    const itemPos = itemRect.top - containerRect.top + scrollTop
    if (itemPos < scrollTop) {
        container.scrollTop = itemPos
    } else if (itemPos > scrollTop + containerRect.height - itemRect.height) {
        container.scrollTop = itemPos + itemRect.height - containerRect.height
    }
}

const MenuList = forwardRef((props: MenuListProps, ref) => {
    const { children, onSelect, autoSelectFirstItem, onClose, closeOnSelect } = props

    const descendants = useDescendants<MenuDescendantProps>()
    const [selectedIndex, setSelectedIndex] = useState(-1)

    useEffect(() => {
        if (autoSelectFirstItem) {
            setTimeout(() =>
                setSelectedIndex(
                    descendants.items.findIndex((item) => !item.props.isDisabled)
                )
            )
            // TODO clear timeout just in case
        }
    }, [])

    useKey('Escape', onClose)

    const select = useCallback(
        (index: number) => {
            let { onSelect: itemOnSelect, value } = descendants.items[index].props
            if (itemOnSelect) itemOnSelect()
            if (onSelect && value !== undefined) onSelect(value)
            if (closeOnSelect) onClose()
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
    const containerRef = useRef<HTMLElement>()

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            const selectableDescendants = descendants.items.filter(
                (item) => !item.props.isDisabled
            )
            const mapIndexFromSelectable = (index: number) =>
                descendants.items.findIndex(
                    (item) => item === selectableDescendants[index]
                )
            const selectableIndex = selectableDescendants.findIndex(
                (item) => item === descendants.items[selectedIndex]
            )
            const selectItem = (index: number) => {
                setSelectedIndex(index)
                let item = descendants.items[index]?.element
                scrollIntoView(item)
            }
            const handlers: { [key: string]: (e: React.KeyboardEvent) => void } = {
                ArrowDown: () => {
                    let nextIndex = mapIndexFromSelectable(
                        getNextIndex(selectableIndex, selectableDescendants.length)
                    )
                    selectItem(nextIndex)
                },
                ArrowUp: () => {
                    let prevIndex = mapIndexFromSelectable(
                        getPrevIndex(selectableIndex, selectableDescendants.length)
                    )
                    selectItem(prevIndex)
                },
                Home: () => selectItem(mapIndexFromSelectable(0)),
                End: () =>
                    selectItem(mapIndexFromSelectable(selectableDescendants.length - 1)),
                Enter: () => select(selectedIndex)
            }
            const handler = handlers[event.key]
            if (handler) {
                event.preventDefault()
                handler(event)
            }
        },
        [selectedIndex]
    )

    return (
        <div
            style={styles.root}
            onKeyDown={onKeyDown}
            tabIndex={0}
            ref={mergeRefs(containerRef, ref)}
        >
            <MenuContext.Provider value={context}>{children}</MenuContext.Provider>
        </div>
    )
})

const menuStyles = (props: MenuProps, isOpen: boolean): FloralStyles => ({
    overlay: {
        background: 'transparent',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        userSelect: 'none',
        pointerEvents: isOpen ? 'all' : 'none'
    },
    list: {
        background: 'white',
        overflowY: 'auto'
    }
})

const useMeasureLazy = ({ isEnabled }: { isEnabled: boolean }) => {
    const elemRef = useRef(null)
    const setElem = (value) => {
        elemRef.current = value
    }
    const [rect, setRect] = useState<DOMRect>({} as DOMRect)
    useLayoutEffect(() => {
        if (!isEnabled || !elemRef.current) return
        let observer = new ResizeObserver((entries) => {
            if (entries[0]) setRect(entries[0].contentRect)
        })
        observer.observe(elemRef.current)
        return () => observer.disconnect()
    }, [isEnabled])
    return [setElem, rect]
}

interface MenuPopupProps {
    renderProps: MenuRenderProps
    menuProps: React.ComponentProps<typeof Menu>
    styles: { [key: string]: React.CSSProperties }
}

const MenuPopup = forwardRef((props: MenuPopupProps, ref) => {
    const { renderProps, menuProps, styles } = props
    const { isOpen, isActive, open, close, openValue, side, triggerWidth } = renderProps
    const {
        maxHeight,
        placement,
        onSelect,
        closeOnSelect,
        matchWidth,
        menu,
        autoSelectFirstItem,
        Animation
    } = menuProps

    const viewport = useViewport()
    const [contrainedMaxHeight, setConstrainedMaxHeight] = useState(0)
    useLayoutEffect(() => {
        if (!isOpen) return
        let availableHeight = viewport.height - 2 * (placement?.padding || 0)
        if (maxHeight !== undefined) {
            availableHeight = Math.min(availableHeight, maxHeight)
        }
        setConstrainedMaxHeight(availableHeight)
    }, [isOpen, maxHeight, placement, viewport.height])

    return (
        <>
            <Layer type="popup" isActive={isActive}>
                <div
                    onClick={close}
                    onDragStart={(e) => e.preventDefault()}
                    style={styles.overlay}
                />
            </Layer>
            <Animation openValue={openValue} side={oppositeSides[side]}>
                <FocusLock disabled={!isOpen}>
                    <MenuList
                        style={{
                            ...styles.list,
                            maxHeight: contrainedMaxHeight,
                            minWidth: matchWidth ? triggerWidth : 'auto'
                        }}
                        ref={ref}
                        onSelect={onSelect}
                        onClose={close}
                        closeOnSelect={closeOnSelect}
                        autoSelectFirstItem={autoSelectFirstItem!}
                    >
                        {menu(renderProps)}
                    </MenuList>
                </FocusLock>
            </Animation>
        </>
    )
})

export interface MenuRenderProps {
    isOpen: boolean
    isActive: boolean
    open: () => void
    close: () => void
    side: PopupSide
    triggerWidth: number
}

const Menu = (props: MenuProps) => {
    const { children, placement, springConfig } = props
    const [isOpen, setIsOpen] = useControlledState(props, 'isOpen', false)
    const [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0, { config: springConfig })
    const [side, setSide] = useState<PopupSide>('top')
    const isActive = isOpen || !isRest
    const styles = useStyles(menuStyles, [props, isOpen])
    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    const [measureRef, { width }] = useMeasureLazy({ isEnabled: isActive })
    const renderProps = {
        isOpen,
        isActive,
        open,
        close,
        openValue,
        side,
        triggerWidth: width
    }

    const popup = (ref) => (
        <MenuPopup
            ref={ref}
            renderProps={renderProps}
            menuProps={props}
            styles={styles}
        />
    )

    return (
        <Popup
            placement={placement}
            isActive={isActive}
            onChangeSide={setSide}
            popup={popup}
        >
            {(ref) => children(mergeRefs(ref, measureRef), renderProps)}
        </Popup>
    )
}

Menu.defaultProps = {
    closeOnSelect: true,
    placement: { ...defaultPlacement, constrain: true, padding: 16 },
    Animation: SlideAnimation,
    springConfig: configs.stiff,
    autoSelectFirstItem: true
}

export { Menu, MenuList, MenuItem }
