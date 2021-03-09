import React, { useState, createContext, useContext, useCallback } from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'

import { useDescendant, useDescendants } from '../utils/descendants'
import { initialTapState, TapState } from '../types'

interface MenuContextProps {
    descendants: any
    selectedIndex: number
    setSelectedIndex: (index: number) => void
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined)

interface MenuItemProps {
    isDisabled?: boolean
    onSelect?: () => void
    children: React.ReactNode
}

const MenuItem = (props: MenuItemProps) => {
    const { isDisabled, onSelect, children } = props
    const { descendants, selectedIndex, setSelectedIndex } = useContext(
        MenuContext
    )!
    const { ref, index } = useDescendant(descendants, { isDisabled })
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

interface MenuProps {
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

interface MenuDescendantProps {
    isDisabled: boolean
}

const Menu = (props: MenuProps) => {
    const { children } = props
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
            const mapSelectedIndex = (index: number) =>
                descendants.items.findIndex(
                    (item) => item === selectableDescendants[index]
                )
            const handlers = {
                ArrowDown: () => {
                    let nextIndex = mapSelectedIndex(
                        getNextIndex(
                            selectableIndex,
                            selectableDescendants.length
                        )
                    )
                    setSelectedIndex(nextIndex)
                },
                ArrowUp: () => {
                    let prevIndex = mapSelectedIndex(
                        getPrevIndex(
                            selectableIndex,
                            selectableDescendants.length
                        )
                    )
                    setSelectedIndex(prevIndex)
                },
                Home: () => {
                    setSelectedIndex(mapSelectedIndex(0))
                },
                End: () => {
                    setSelectedIndex(
                        mapSelectedIndex(selectableDescendants.length - 1)
                    )
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
