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
