import React, {
    useState,
    createContext,
    useContext,
    useRef,
    useCallback
} from 'react'
// @ts-ignore
import Taply from 'taply/lib/new'
// @ts-ignore
import { useStyles } from 'floral'

import {
    useDescendant,
    useDescendants,
    DescendantContext
} from '../utils/descendants'
import { initialTapState, TapState } from '../types'

interface MenuContextProps {
    descendants: DescendantContext<HTMLElement>
    selectedIndex: number
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined)

interface MenuItemProps {
    isDisabled?: boolean
    isFocusable?: boolean
    onSelect?: () => void
    children: React.ReactNode
}

const MenuItem = (props: MenuItemProps) => {
    let { isDisabled, isFocusable, onSelect, children } = props
    let ref = useRef<HTMLElement>()
    let [tapState, setTapState] = useState(initialTapState)
    let { descendants, selectedIndex } = useContext(MenuContext)!
    let index = useDescendant({
        context: descendants,
        elem: ref.current,
        isDisabled
    })
    let isSelected = selectedIndex === index
    let s = useStyles(undefined, [props, { isSelected, tapState }])
    return (
        <Taply
            onChangeTapState={setTapState}
            onTap={onSelect}
            isDisabled={isDisabled}
            isFocusable={isFocusable}
        >
            <div style={s.root} ref={ref}>
                {children}
            </div>
        </Taply>
    )
}

MenuItem.defaultProps = {
    isFocusable: true
}

interface MenuProps {
    isActive: boolean
    children: React.ReactNode
}

const getNextIndex = (currentIndex: number, length: number) =>
    currentIndex < length ? currentIndex + 1 : 0

const getPrevIndex = (currentIndex: number, length: number) =>
    currentIndex > 0 ? currentIndex - 1 : length - 1

const Menu = (props: MenuProps) => {
    let { children } = props
    let descendants = useDescendants()
    let [selectedIndex, setSelectedIndex] = React.useState(-1)
    let s = useStyles(undefined, [props])

    let onKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            const handlers = {
                ArrowDown: () => {
                    const nextIndex = getNextIndex(
                        selectedIndex,
                        descendants.items.length
                    )
                    setSelectedIndex(nextIndex)
                },
                ArrowUp: () => {
                    const prevIndex = getPrevIndex(
                        selectedIndex,
                        descendants.items.length
                    )
                    setSelectedIndex(prevIndex)
                },
                Home: () => {
                    setSelectedIndex(1)
                },
                End: () => {
                    setSelectedIndex(length - 1)
                }
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
        <MenuContext.Provider value={{ descendants, selectedIndex }}>
            <div style={s.root} onKeyDown={onKeyDown} tabIndex={-1}>
                {children}
            </div>
        </MenuContext.Provider>
    )
}

export { Menu, MenuItem }
