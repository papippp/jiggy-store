import { useCallback, useEffect, useState } from "react"
import ToastNotifications from "./ToastNotifications"


export default function ToastProvider() {
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        const handler = (e) => {
            const id = Date.now()
             setToasts(prev => [...prev, { id, message: e.detail.message, type: e.detail.type || 'success' }])
        }
        window.addEventListener('showNotification', handler)
        return () => window.removeEventListener('showNotification', handler)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])
  return (
    <>
    {toasts.map(toast => (
        <ToastNotifications
        key={toast.id}
        message= {toast.message}
        type= {toast.type}
        onClose={() => removeToast(toast.id)}

        />
    ))}  
    </>
  )
}
