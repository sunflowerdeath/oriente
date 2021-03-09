import React from 'react'
// @ts-ignore
import { extendComponentStyles } from 'floral'

import { Menu, MenuItem } from '../../core/Menu'

const exampleItemStyles = ({ isDisabled }, { isSelected }) => ({
    root: {
        color: isDisabled ? '#666' : 'white',
        background: isSelected ? 'rgba(255,255,255,.3)' : 'transparent',
        padding: 4
    }
})

const ExampleMenuItem = extendComponentStyles(MenuItem, exampleItemStyles)

const MenuExample = () => (
    <Menu onSelect={(value) => console.log(`Menu onSelect: ${value}`)}>
        <ExampleMenuItem
            value="one"
            onSelect={() => console.log(`MenuItem onSelect`)}
        >
            Item
        </ExampleMenuItem>
        <ExampleMenuItem value="two" isDisabled>
            Disabled item
        </ExampleMenuItem>
        <ExampleMenuItem value="three">Item</ExampleMenuItem>
    </Menu>
)

export default MenuExample
