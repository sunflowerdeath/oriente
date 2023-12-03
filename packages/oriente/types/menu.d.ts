/// <reference types="react" />
import { AnimatedValue, SpringConfig } from 'react-spring';
import { StyleProps } from './styles';
import { AnimationFunction } from './animation';
import { PopupPlacement, PopupSide } from './PopupController';
export interface MenuProps extends StyleProps<[MenuProps]> {
    /** Content of the dropdown menu */
    menu: (props: MenuRenderProps) => React.ReactNode;
    /** Trigger element that menu will be attached to */
    children: (ref: any, props: MenuRenderProps) => React.ReactNode;
    /** Placement of the menu relative to the target */
    placement?: Partial<PopupPlacement>;
    /** Function that is called when `<MenuItem>` is selected */
    onSelect?: (value?: string) => void;
    /** Whether the menu should close when an item is selected */
    closeOnSelect?: boolean;
    /** Component for hide and show animation */
    animation: AnimationFunction;
    /** Maximum height of the list, in px. */
    maxHeight?: number;
    /** Select first item on open */
    autoSelectFirstItem?: boolean;
    /** If `true`, menu width will match the width of the button element. */
    matchWidth?: boolean;
    /** Config for `react-spring` animation */
    springConfig?: SpringConfig;
}
export interface MenuListProps extends StyleProps<[MenuListProps]> {
    children: React.ReactNode;
    onFocus?: () => void;
    onBlur?: () => void;
    onClose: () => void;
    onSelect?: (value?: string) => void;
    autoSelectFirstItem: boolean;
    closeOnSelect?: boolean;
}
export interface MenuItemProps extends StyleProps<[MenuItemProps]> {
    /** Value of the item that will be passed to the `onSelect()` handler of
     * the Menu */
    value?: string;
    /**
     * Handler that is called when the item is selected by clicking on it or
     * pressing the `Enter` key
     */
    onSelect?: () => void;
    isDisabled?: boolean;
    onHover?: () => void;
    onBlur?: () => void;
    children: React.ReactNode | ((isSelected: boolean) => React.ReactNode);
}
declare const MenuItem: import("react").ForwardRefExoticComponent<MenuItemProps & import("react").RefAttributes<HTMLElement>>;
declare const MenuList: import("react").ForwardRefExoticComponent<MenuListProps & import("react").RefAttributes<unknown>>;
export interface MenuRenderProps {
    isOpen: boolean;
    isActive: boolean;
    open: () => void;
    close: () => void;
    side: PopupSide;
    triggerWidth: number;
    openValue: AnimatedValue<object>;
}
declare const Menu: {
    (props: MenuProps): import("react/jsx-runtime").JSX.Element;
    defaultProps: {
        closeOnSelect: boolean;
        placement: {
            constrain: boolean;
            padding: number;
            side: PopupSide;
            align: import("./PopupController").PopupAlign;
            offset: number;
            flip: boolean;
        };
        animation: AnimationFunction;
        springConfig: {
            tension: number;
            friction: number;
        };
        autoSelectFirstItem: boolean;
    };
};
export { Menu, MenuList, MenuItem };
