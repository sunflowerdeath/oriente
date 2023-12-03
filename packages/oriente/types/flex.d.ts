/// <reference types="react" />
import { StyleProps } from './styles';
declare type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>;
export interface FlexProps extends DivProps, StyleProps<[FlexProps]> {
    /** Flex direction */
    dir: 'col' | 'row';
    /** Gap between elements */
    gap?: string | number;
    /** Flex wrap */
    wrap?: boolean;
    /** Flex align */
    align?: string;
    /** Flex justify */
    justify?: string;
    children: React.ReactNode;
}
declare const Flex: import("react").ForwardRefExoticComponent<FlexProps & import("react").RefAttributes<HTMLDivElement>>;
declare const Row: import("react").ForwardRefExoticComponent<Omit<FlexProps, "dir"> & import("react").RefAttributes<HTMLDivElement>>;
declare const Col: import("react").ForwardRefExoticComponent<Omit<FlexProps, "dir"> & import("react").RefAttributes<HTMLDivElement>>;
export { Flex, Row, Col };
