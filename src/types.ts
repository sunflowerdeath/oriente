import React from 'react'

export interface TapState {
    isHovered: boolean
    isFocused: boolean
    isPressed: boolean
}

export const initialTapState = {
    isHovered: false,
    isFocused: false,
    isPressed: false
}

interface FloralStyles {
    [key: string]: React.CSSProperties
}

export interface FloralProps {
    style: React.CSSProperties
    styles: FloralStyles | ((...deps: any) => FloralStyles)
}

export interface PopupPlacement {
    side: 'left' | 'top' | 'right' | 'bottom'
    align: 'start' | 'center' | 'end'
    offset: number
    flip: boolean
    constrain: boolean
    padding: number
}
