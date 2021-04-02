import React from 'react'

import { useToast, ToastContainer } from '../../core/toasts'

const toastStyle = {
    color: 'white',
    background: 'green',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 16
}

const ToastExample = () => {
    let toast = useToast()

    let showToast = () => toast.show({ children: 'Toast', style: toastStyle })

    return <button onClick={showToast}>Show toast</button>
}

export default ToastExample
