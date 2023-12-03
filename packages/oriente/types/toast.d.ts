/// <reference types="react" />
import { SpringConfig } from 'react-spring';
export declare type ToastPlacement = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
export interface ToastContainerProps {
    children: React.ReactNode;
    springConfig?: SpringConfig;
}
export interface ToastProps {
    children: React.ReactNode | ((close: () => void) => React.ReactNode);
    onClose?: () => void;
}
export interface ShowToastOptions extends ToastProps {
    duration?: number;
    placement?: ToastPlacement;
}
export interface ToastController {
    show: (options: ShowToastOptions) => number;
    close: (id: number) => void;
}
declare const ToastContainer: {
    ({ children, springConfig }: ToastContainerProps): import("react/jsx-runtime").JSX.Element;
    defaultProps: {
        springConfig: {
            tension: number;
            friction: number;
        };
    };
};
declare const useToast: () => ToastController;
export { ToastContainer, useToast };
