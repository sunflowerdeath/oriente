import React, { useContext, useState, forwardRef } from 'react'
// @ts-ignore
import { extendComponentStyles } from 'floral'
import { range } from 'lodash'

import { Menu, MenuList, MenuItem, Tooltip } from 'oriente'

import buttonStyle from './buttonStyle'

const exampleItemStyles = ({ isDisabled }, { isSelected }) => ({
    root: {
        color: isDisabled ? '#999' : '#333',
        background: isSelected ? 'rgba(0,0,0,.15)' : 'transparent',
        padding: '12px 16px',
        cursor: 'default'
    }
})

const ExampleMenuItem = forwardRef((props: any, ref) => (
    <MenuItem ref={ref} {...props} styles={[exampleItemStyles, props.styles]} />
))

const MenuListExample = () => (
    <MenuList onSelect={(value) => console.log(`Menu onSelect: ${value}`)}>
        <ExampleMenuItem
            value="one"
            onSelect={() => console.log(`MenuItem onSelect`)}
        >
            Item 1
        </ExampleMenuItem>
        <ExampleMenuItem value="two" isDisabled>
            Disabled item 2
        </ExampleMenuItem>
        <ExampleMenuItem value="three">Item 3</ExampleMenuItem>
        <ExampleMenuItem value="four">Item 4</ExampleMenuItem>
    </MenuList>
)

const TooltipMenuItem = (props: any) => {
    const [isHovered, setIsHovered] = useState(false)
    return (
        <Tooltip
            tooltip="test"
            placement={{ side: 'right', align: 'center', offset: 5 }}
            style={{ background: 'white', padding: 5 }}
        >
            <ExampleMenuItem {...props} />
        </Tooltip>
    )
}

const MenuExample = () => {
    let menu = () => (
        <>
            <ExampleMenuItem
                value="one"
                onSelect={() => console.log(`MenuItem onSelect`)}
            >
                Item 1
            </ExampleMenuItem>
            <TooltipMenuItem value="disabled-1" isDisabled>
                Disabled item
            </TooltipMenuItem>
            <TooltipMenuItem value="disabled-1" isDisabled>
                Disabled item
            </TooltipMenuItem>
            <TooltipMenuItem value="three">Item 3</TooltipMenuItem>
            <ExampleMenuItem value="four">Item 4</ExampleMenuItem>
        </>
    )

    return (
        <Menu
            onSelect={(value) => console.log(`Menu onSelect: ${value}`)}
            menu={menu}
        >
            {(ref, { open }) => (
                <div ref={ref} onClick={open} style={buttonStyle}>
                    Open menu
                </div>
            )}
        </Menu>
    )
}

const ScrollMenuExample = () => {
    let [maxHeight, setMaxHeight] = useState(false)
    let menu = () =>
        range(1, 50).map((i) => (
            <ExampleMenuItem value="one">Item {i}</ExampleMenuItem>
        ))

    return (
        <>
            <Menu
                onSelect={(value) => console.log(`Menu onSelect: ${value}`)}
                menu={menu}
                maxHeight={maxHeight ? 250 : undefined}
            >
                {(ref, { open }) => (
                    <div ref={ref} onClick={open} style={buttonStyle}>
                        Open menu
                    </div>
                )}
            </Menu>{' '}
            <label>
                <input
                    type="checkbox"
                    value={maxHeight}
                    onChange={() => setMaxHeight((v) => !v)}
                />{' '}
                maxHeight = 250
            </label>
        </>
    )
}

export { MenuListExample, MenuExample, ScrollMenuExample }