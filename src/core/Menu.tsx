import React, { useState, createContext, useContext, useCallback } from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'

import {
    useDescendant,
    useDescendants,
    Descendants
} from '../utils/descendants'
import { initialTapState, TapState, FloralProps } from '../types'

interface MenuDescendantProps {
    isDisabled?: boolean
    onSelect?: () => void
    value?: string
}

interface MenuContextProps {
    descendants: Descendants<MenuDescendantProps>
    selectedIndex: number
    setSelectedIndex: (index: number) => void
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined)

interface MenuItemProps {
    isDisabled?: boolean
    onSelect?: () => void
    value?: string
    children: React.ReactNode
}

const MenuItem = (props: MenuItemProps) => {
    const { isDisabled, onSelect, value, children } = props
    const { descendants, selectedIndex, setSelectedIndex } = useContext(
        MenuContext
    )!
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
            onTap={onSelect}
            isDisabled={isDisabled}
            isFocusable={false}
        >
            <div style={styles.root} ref={ref}>
                {children}
            </div>
        </Taply>
    )
}

interface MenuProps extends FloralProps {
    isActive: boolean
    children: React.ReactNode
    onFocus?: () => void
    onBlur?: () => void
    onSelect?: (value: string) => void
}

const getNextIndex = (index: number, length: number) =>
    index < length - 1 ? index + 1 : 0

const getPrevIndex = (index: number, length: number) =>
    index > 0 ? index - 1 : length - 1

const menuStyles = {
    root: { outline: 'none' }
}

const Menu = (props: MenuProps) => {
    const { children, onSelect } = props
    const descendants = useDescendants<MenuDescendantProps>()
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const context = { descendants, selectedIndex, setSelectedIndex }
    const styles = useStyles(menuStyles, [props])

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            const selectableDescendants = descendants.items.filter(
                (item) => !item.props.isDisabled
            )
            const selectableIndex = selectableDescendants.findIndex(
                (item) => item === descendants.items[selectedIndex]
            )
            if (selectableIndex === -1) return
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
                Enter: () => {
                    let item = descendants.items[selectedIndex]
                    let { onSelect: itemOnSelect, value } = item.props
                    if (itemOnSelect) itemOnSelect()
                    if (onSelect && value !== undefined) onSelect(value)
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
        <div style={styles.root} onKeyDown={onKeyDown} tabIndex={0}>
            <MenuContext.Provider value={context}>
                {children}
            </MenuContext.Provider>
        </div>
    )
}

export { Menu, MenuItem }
