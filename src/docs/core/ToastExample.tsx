import React from 'react'

import { useToast, ToastContainer, ToastCloseButton } from '../../core/toasts'

const toastStyle = {
    color: 'white',
    background: '#16a085',
    padding: '12px 32px 12px 16px',
    marginBottom: 16
}

const ToastExample = () => {
    let toast = useToast()

    let showToast = () =>
        toast.show({
            children: (
                <>
                    Toast
                    <ToastCloseButton style={{ top: 4, right: 4 }} />
                </>
            ),
            style: toastStyle
        })

    return <button onClick={showToast}>Show toast</button>
}

export default ToastExample
