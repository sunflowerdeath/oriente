

interface MenuProps {
    
}

interface MenuItemProps {
    children: React.ReactNode
    isDisabled: boolean
    onTap: () => void
}

interface DropdownMenu {
    isOpen?: boolean
    onChangeIsOpen?: boolean
    trigger: React.ReactNode
}

<Dropdown
    closeOnSelect={true}
    menu={
        <>
            <DropdownItem onTap={doSomething}>First</Dropdown>
            <DropdownItem onTap={doSomething}>Second</Dropdown>
        </>
    }
>
    {(open) => <Button onTap={open}>open menu</Button>}
</DropdownMenu>
