import { range } from 'lodash'
import { Menu, MenuItem, MenuList, Tooltip } from 'oriente'
import React, { forwardRef, useState } from 'react'
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
        <ExampleMenuItem value="one" onSelect={() => console.log(`MenuItem onSelect`)}>
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

interface MenuExampleProps extends React.ComponentProps<Menu> {
    children?: React.ReactNode
}

const MenuExample = ({ children = 'Open menu', ...restProps }: MenuExampleProps) => {
    let menu = () => (
        <>
            <TooltipMenuItem value="disabled-1" isDisabled>
                Disabled item
            </TooltipMenuItem>
            <ExampleMenuItem
                value="one"
                onSelect={() => console.log(`MenuItem onSelect`)}
            >
                Item 1
            </ExampleMenuItem>
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
            {...restProps}
        >
            {(ref, { open }) => (
                <div ref={ref} style={{ display: 'inline-block' }}>
                    <div onClick={open} style={buttonStyle}>
                        {children}
                    </div>
                </div>
            )}
        </Menu>
    )
}

const ScrollMenuExample = () => {
    let [maxHeight, setMaxHeight] = useState(false)
    let menu = () =>
        range(1, 50).map((i) => <ExampleMenuItem value="one">Item {i}</ExampleMenuItem>)

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

const MatchWidthExample = () => {
    let [match, setMatch] = useState(false)
    return (
        <>
            <MenuExample matchWidth={match}>Button with very long text</MenuExample>
            <label>
                <input
                    type="checkbox"
                    value={match}
                    onChange={() => setMatch((v) => !v)}
                />{' '}
                matchWidth
            </label>
        </>
    )
}

export { MenuListExample, MenuExample, ScrollMenuExample, MatchWidthExample }
