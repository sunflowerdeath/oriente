import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from 'react'
import FocusLock from 'react-focus-lock'
import { SpringValue, SpringConfig } from 'react-spring'
import { useKey } from 'react-use'

import { useTaply, TapState } from './taply'
import { StyleProps, StyleMap, useStyles } from './styles'
import {
    OpenAnimation,
    AnimationFunction,
    animationFunctions
} from './animation'
import { Layer } from './layers'
import { Popup } from './popup'
import {
    defaultPlacement,
    oppositeSides,
    PopupPlacement,
    PopupSide
} from './PopupController'
import {
    DescendantsManager,
    useDescendant,
    useDescendants
} from './utils/descendants'
import mergeRefs from './utils/mergeRefs'
import configs from './utils/springConfigs'
import useAnimatedValue from './utils/useAnimatedValue'
import useControlledState from './utils/useControlledState'
import useViewport from './utils/useViewport'
import scrollIntoView from './utils/scrollIntoView'
import useMeasureLazy from './utils/useMeasureLazy'

export interface MenuProps extends StyleProps<[MenuProps]> {
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
    animation?: AnimationFunction

    /** Maximum height of the list, in px. */
    maxHeight?: number

    /** Select first item on open */
    autoSelectFirstItem?: boolean

    /** If `true`, menu width will match the width of the button element. */
    matchWidth?: boolean

    /** Config for `react-spring` animation */
    springConfig?: SpringConfig
}

export interface MenuListProps extends StyleProps<[MenuListProps]> {
    children: React.ReactNode
    onFocus?: () => void
    onBlur?: () => void
    onClose: () => void
    onSelect?: (value?: string) => void
    autoSelectFirstItem: boolean
    closeOnSelect?: boolean
}

export interface MenuItemProps
    extends StyleProps<[MenuItemProps, { isSelected: boolean }]> {
    /** Value of the item that will be passed to the `onSelect()` handler of
     * the Menu */
    value?: string

    /**
     * Handler that is called when the item is selected by clicking on it or
     * pressing the `Enter` key
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

const MenuItem = forwardRef<HTMLElement, MenuItemProps>((props, ref) => {
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
    const onChangeTapState = useCallback(
        (tapState: TapState) => {
            if (tapState.isHovered) setSelectedIndex(index)
        },
        [index]
    )
    const styles = useStyles(undefined, [props, { isSelected }])

    const { tapState, render } = useTaply({
        onChangeTapState,
        onClick: () => menuOnSelect(index),
        isDisabled,
        isFocusable: false
    })

    return render((attrs, taplyRef) => (
        <div
            {...attrs}
            style={styles.root}
            ref={mergeRefs(ref, descendantRef, taplyRef)}
        >
            {typeof children === 'function' ? children(isSelected) : children}
        </div>
    ))
})

const getNextIndex = (index: number, length: number) =>
    index < length - 1 ? index + 1 : 0

const getPrevIndex = (index: number, length: number) =>
    index > 0 ? index - 1 : length - 1

const menuListStyles = {
    root: { outline: 'none' }
}

const MenuList = forwardRef((props: MenuListProps, ref) => {
    const { children, onSelect, autoSelectFirstItem, onClose, closeOnSelect } =
        props

    const descendants = useDescendants<MenuDescendantProps>()
    const [selectedIndex, setSelectedIndex] = useState(-1)

    useEffect(() => {
        if (autoSelectFirstItem) {
            setTimeout(() =>
                setSelectedIndex(
                    descendants.items.findIndex(
                        (item) => !item.props.isDisabled
                    )
                )
            )
            // TODO clear timeout just in case
        }
    }, [])

    useKey('Escape', onClose)

    const select = useCallback(
        (index: number) => {
            const { onSelect: itemOnSelect, value } =
                descendants.items[index].props
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
                const item = descendants.items[index]?.element
                scrollIntoView(item)
            }
            const handlers: {
                [key: string]: (e: React.KeyboardEvent) => void
            } = {
                ArrowDown: () => {
                    const nextIndex = mapIndexFromSelectable(
                        getNextIndex(
                            selectableIndex,
                            selectableDescendants.length
                        )
                    )
                    selectItem(nextIndex)
                },
                ArrowUp: () => {
                    const prevIndex = mapIndexFromSelectable(
                        getPrevIndex(
                            selectableIndex,
                            selectableDescendants.length
                        )
                    )
                    selectItem(prevIndex)
                },
                Home: () => selectItem(mapIndexFromSelectable(0)),
                End: () =>
                    selectItem(
                        mapIndexFromSelectable(selectableDescendants.length - 1)
                    ),
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
            <MenuContext.Provider value={context}>
                {children}
            </MenuContext.Provider>
        </div>
    )
})

const menuStyles = (props: MenuProps, isOpen: boolean): StyleMap => ({
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

interface MenuPopupProps {
    renderProps: MenuRenderProps
    menuProps: MenuProps & typeof menuDefaultProps
    styles: { [key: string]: React.CSSProperties }
}

const MenuPopup = forwardRef((props: MenuPopupProps, ref) => {
    const { renderProps, menuProps, styles } = props
    const { isOpen, isActive, open, close, openValue, side, triggerWidth } =
        renderProps
    const {
        maxHeight,
        placement,
        onSelect,
        closeOnSelect,
        matchWidth,
        menu,
        autoSelectFirstItem,
        animation
    } = menuProps

    const viewport = useViewport()
    const [contrainedMaxHeight, setConstrainedMaxHeight] = useState(0)
    useLayoutEffect(() => {
        if (!isActive) return
        let availableHeight = viewport.height - 2 * (placement?.padding || 0)
        if (maxHeight !== undefined) {
            availableHeight = Math.min(availableHeight, maxHeight)
        }
        setConstrainedMaxHeight(availableHeight)
    }, [isActive, maxHeight, placement, viewport.height])

    return (
        <OpenAnimation
            openValue={openValue}
            fn={animation}
            props={{ side: oppositeSides[side] }}
        >
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
                    autoSelectFirstItem={Boolean(autoSelectFirstItem)}
                >
                    {menu(renderProps)}
                </MenuList>
            </FocusLock>
        </OpenAnimation>
    )
})

export type MenuRenderProps = {
    isOpen: boolean
    isActive: boolean
    open: () => void
    close: () => void
    side: PopupSide
    triggerWidth: number
    openValue: SpringValue<object>
}

const menuDefaultPlacement: Partial<PopupPlacement> = {
    ...defaultPlacement,
    constrain: true,
    padding: 16
}

const menuDefaultProps = {
    closeOnSelect: true,
    placement: menuDefaultPlacement,
    animation: animationFunctions.compose([
        animationFunctions.slide,
        animationFunctions.fade
    ]),
    springConfig: configs.stiff as SpringConfig,
    autoSelectFirstItem: true
}

const Menu = (inProps: MenuProps) => {
    const props = { ...menuDefaultProps, ...inProps }
    const { children, placement, springConfig, matchWidth } = props
    const [isOpen, setIsOpen] = useControlledState(props, 'isOpen', false)
    const [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0, {
        config: springConfig
    })
    const [side, setSide] = useState<PopupSide>('top')
    const isActive = isOpen || !isRest
    const styles = useStyles(menuStyles, [props, isOpen])
    const triggerRef = useRef<HTMLElement>(null)
    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => {
        setIsOpen(false)
        setTimeout(() => triggerRef.current?.focus?.())
    }, [])
    const [measureRef, { width }] = useMeasureLazy({
        isEnabled: isActive && matchWidth
    })
    const renderProps: MenuRenderProps = {
        isOpen,
        isActive,
        open,
        close,
        openValue,
        side,
        triggerWidth: width
    }

    const popup = (ref: React.Ref<HTMLElement>) => (
        <MenuPopup
            ref={ref}
            renderProps={renderProps}
            menuProps={props}
            styles={styles}
        />
    )

    return (
        <>
            {isActive && (
                <Layer type="popup" isActive={true}>
                    <div
                        onClick={close}
                        onDragStart={(e) => e.preventDefault()}
                        style={styles.overlay}
                    />
                </Layer>
            )}
            <Popup
                placement={placement}
                isActive={isActive}
                onChangeSide={setSide}
                popup={popup}
            >
                {(ref) =>
                    children(
                        mergeRefs(ref, triggerRef, measureRef),
                        renderProps
                    )
                }
            </Popup>
        </>
    )
}

export { Menu, MenuList, MenuItem }
