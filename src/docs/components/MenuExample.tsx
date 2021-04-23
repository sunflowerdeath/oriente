import React, { useContext, useState, forwardRef } from 'react'
// @ts-ignore
import { extendComponentStyles } from 'floral'

import { Menu, MenuList, MenuItem, MenuContext } from '../../core/Menu'
import { Tooltip } from '../../core/Tooltip'

const exampleItemStyles = ({ isDisabled }, { isSelected }) => ({
    root: {
        color: isDisabled ? '#999' : '#333',
        background: isSelected ? 'rgba(0,0,0,.15)' : 'transparent',
        padding: '12px 16px',
        cursor: 'default'
    }
})

const ExampleMenuItem = forwardRef((props: any, ref) => (
    <MenuItem
        ref={ref}
        {...props}
        styles={[exampleItemStyles, props.styles]}
    />
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
            <TooltipMenuItem value="two" isDisabled>
                Disabled item 2
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
                <div ref={ref} onClick={open}>
                    Open menu
                </div>
            )}
        </Menu>
    )
}

export { MenuListExample, MenuExample }
