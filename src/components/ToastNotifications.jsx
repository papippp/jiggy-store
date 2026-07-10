import  { useEffect } from 'react'

export default function ToastNotifications({message , type = 'success', onClose}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    },[onClose])
      const bgColor = type === 'success' ? '#000' : type === 'error' ? '#dc3545' : '#333'

  return (
    <div
     style={{
                position: 'fixed',
                bottom: '90px',
                right: '20px',
                zIndex: 2000,
                backgroundColor: bgColor,
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontSize: '0.85rem',
                letterSpacing: '0.5px',
                maxWidth: '300px',
                animation: 'fadeInUp 0.3s ease'
            }}
    >
        {message}
    </div>
  )
}
