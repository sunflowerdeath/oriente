import React, { useState } from 'react'

import {
    useToast,
    ToastContainer,
    ToastCloseButton,
    ToastPlacement
} from '../../core/toasts'

const toastStyle = {
    color: 'white',
    background: '#16a085',
    padding: '12px 32px 12px 16px',
    marginBottom: 16
}

const ToastExample = ({ placement }: { placement?: ToastPlacement }) => {
    let toast = useToast()
    let showToast = () =>
        toast.show({
            children: (
                <>
                    Toast
                    <ToastCloseButton style={{ top: 4, right: 4 }} />
                </>
            ),
            style: toastStyle,
            placement
        })
    return <button onClick={showToast}>Show toast</button>
}

const ToastPlacementExample = () => {
    const [placement, setPlacement] = useState<ToastPlacement>('top-right')
    const items: ToastPlacement[] = [
        'top-right',
        'top',
        'top-left',
        'bottom-right',
        'bottom',
        'bottom-left'
    ]
    return (
        <>
            <div>
                {items.map((value) => (
                    <label>
                        <input
                            type="checkbox"
                            onChange={() => setPlacement(value)}
                            checked={placement === value}
                        />
                        {value}
                    </label>
                ))}
            </div>
            <ToastExample placement={placement} />
        </>
    )
}

export { ToastExample, ToastPlacementExample }
