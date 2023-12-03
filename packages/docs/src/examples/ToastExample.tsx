import { useState } from 'react'

import { useToast, ToastContainer, ToastPlacement } from 'oriente'

import buttonStyle from '../buttonStyle'

const toastStyle = {
    color: 'white',
    background: '#16a085',
    padding: '12px 32px 12px 16px',
    marginBottom: 16
}

const ToastExample = ({ placement }: { placement?: ToastPlacement }) => {
    const toast = useToast()
    const showToast = () =>
        toast.show({
            children: <div style={toastStyle}>I'm a toast</div>,
            placement
        })
    return (
        <div style={buttonStyle} onClick={showToast}>
            Show toast
        </div>
    )
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
