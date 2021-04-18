import React from 'react'
// @ts-ignore
import { extendComponentStyles } from 'floral'

import { Menu, MenuList, MenuItem } from '../../core/Menu'

const exampleItemStyles = ({ isDisabled }, { isSelected }) => ({
    root: {
        color: isDisabled ? '#999' : '#333',
        background: isSelected ? 'rgba(0,0,0,.15)' : 'transparent',
        padding: '12px 16px'
    }
})

const ExampleMenuItem = extendComponentStyles(MenuItem, exampleItemStyles)

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

const MenuExample = () => {
    let menu = () => (
        <>
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
