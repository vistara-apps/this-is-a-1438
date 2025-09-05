import React from 'react'
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'

const Alert = ({ variant = 'info', children, className = '' }) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertCircle,
    },
    destructive: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircle,
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
    },
  }

  const { container, icon: Icon } = variants[variant]

  return (
    <div className={`border rounded-md p-4 ${container} ${className}`}>
      <div className="flex">
        <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

export default Alert