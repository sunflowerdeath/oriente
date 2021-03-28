/*
    
    <ToastContainer>
    </ToastContainer>
    
    let toast = useToast()
    
    toast({
        side,
        render: ({ onClose, onHold }) => ...,
        duration: 3000,
        holdOnHover
        closeButton        
    })
    
    let [toasts, setToasts] = useState([])
    
    let add = () => {
        let toast = { toast }
        setToasts([
            ...toasts,
            toast
        ])
    }
    
    let transitions = useTransition(toasts, ??, {
    })
*/    
