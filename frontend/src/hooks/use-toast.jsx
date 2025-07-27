"use client"

import { useState, useCallback } from "react"

// Toast context and provider would normally go here, but for simplicity
// we'll create a basic implementation

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, duration = 5000 }) => {
    const id = ++toastId
    const newToast = {
      id,
      title,
      description,
      duration,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}

// Simple Toast component for display
export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] animate-in slide-in-from-top-2"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {toast.title && <div className="font-semibold text-gray-900 mb-1">{toast.title}</div>}
              {toast.description && <div className="text-sm text-gray-600">{toast.description}</div>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
