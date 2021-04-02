import React from 'react'

import { useToast, ToastContainer } from '../../core/toasts'

const toastStyle = {
    color: 'white',
    background: '#16a085',
    padding: '12px 16px',
    marginBottom: 16
}

const ToastExample = () => {
    let toast = useToast()

    let showToast = () =>
        toast.show({
            children: (close) => (
                <>
                    Toast
                    <button onClick={close}>x</button>
                </>
            ),
            style: toastStyle
        })

    return <button onClick={showToast}>Show toast</button>
}

export default ToastExample
