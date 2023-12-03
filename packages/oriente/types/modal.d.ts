/// <reference types="react" />
import { SpringConfig } from 'react-spring';
import { StyleProps } from './styles';
import { AnimationFunction } from './animation';
export interface ModalProps extends StyleProps<[ModalProps]> {
    /** Content of the modal */
    children: (close: () => void) => React.ReactNode;
    /** Whether the modal is open */
    isOpen?: boolean;
    /** Function that is called when the modal requests to close */
    onClose: () => void;
    /** Ref to the element that will get focus on opening the modal */
    initialFocusRef?: any;
    /** Whether the modal should close on click on overlay */
    closeOnOverlayClick?: boolean;
    /** Whether the modal should close on pressing the Esc key */
    closeOnEsc?: boolean;
    /** Vertically centers the modal */
    isCentered?: boolean;
    /** CSS value for the width of the modal window */
    width?: string | number;
    /** Function for hide and show animation */
    animation?: AnimationFunction;
    /** Config for `react-spring` animation */
    springConfig?: SpringConfig;
}
declare const Modal: {
    (_props: ModalProps): import("react/jsx-runtime").JSX.Element;
    defaultProps: {
        closeOnEsc: boolean;
        width: number;
        animation: AnimationFunction;
        springConfig: {
            tension: number;
            friction: number;
        };
        isOpen: boolean;
    };
};
export interface UseModalProps extends Omit<React.ComponentProps<typeof Modal>, 'isOpen'> {
    Component: React.ComponentType<ModalProps>;
}
export interface UseModal {
    close: () => void;
    open: () => void;
    render: () => React.ReactNode;
}
declare const useModal: (props: UseModalProps) => UseModal;
export { Modal, useModal };
