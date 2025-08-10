'use client'

import * as React from 'react'
import type { ReactNode } from 'react'

const TOAST_LIMIT = 1

export interface ToastProps {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  duration?: number
  variant?: 'default' | 'destructive'
  dismiss?: () => void
}

export interface ToastState {
  toasts: ToastProps[]
}

type ToastListener = (state: ToastState) => void

let count = 0
function generateId(): string {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastStore = {
  state: {
    toasts: [],
  } as ToastState,
  listeners: [] as ToastListener[],

  getState: (): ToastState => toastStore.state,

  setState: (
    nextState: ToastState | ((state: ToastState) => ToastState)
  ): void => {
    if (typeof nextState === 'function') {
      toastStore.state = nextState(toastStore.state)
    } else {
      toastStore.state = { ...toastStore.state, ...nextState }
    }

    toastStore.listeners.forEach(listener => listener(toastStore.state))
  },

  subscribe: (listener: ToastListener): (() => void) => {
    toastStore.listeners.push(listener)
    return () => {
      toastStore.listeners = toastStore.listeners.filter(l => l !== listener)
    }
  },
}

export interface ToastReturn {
  id: string
  dismiss: () => void
  update: (props: Partial<ToastProps>) => void
}

export const toast = (
  props: Omit<ToastProps, 'id' | 'dismiss'>
): ToastReturn => {
  const id = generateId()

  const update = (updateProps: Partial<ToastProps>): void =>
    toastStore.setState(state => ({
      ...state,
      toasts: state.toasts.map(t =>
        t.id === id ? { ...t, ...updateProps } : t
      ),
    }))

  const dismiss = (): void =>
    toastStore.setState(state => ({
      ...state,
      toasts: state.toasts.filter(t => t.id !== id),
    }))

  toastStore.setState(state => ({
    ...state,
    toasts: [{ ...props, id, dismiss }, ...state.toasts].slice(0, TOAST_LIMIT),
  }))

  return {
    id,
    dismiss,
    update,
  }
}

export interface UseToastReturn {
  toast: (props: Omit<ToastProps, 'id' | 'dismiss'>) => ToastReturn
  toasts: ToastProps[]
  dismiss: (toastId?: string) => void
}

export function useToast(): UseToastReturn {
  const [state, setState] = React.useState<ToastState>(toastStore.getState())

  React.useEffect(() => {
    const unsubscribe = toastStore.subscribe(newState => {
      setState(newState)
    })

    return unsubscribe
  }, [])

  React.useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    state.toasts.forEach(toastItem => {
      if (toastItem.duration === Infinity) {
        return
      }

      const timeout = setTimeout(() => {
        toastItem.dismiss?.()
      }, toastItem.duration || 5000)

      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [state.toasts])

  const dismiss = (toastId?: string): void => {
    toastStore.setState(state => ({
      ...state,
      toasts: toastId ? state.toasts.filter(t => t.id !== toastId) : [],
    }))
  }

  return {
    toast,
    toasts: state.toasts,
    dismiss,
  }
}
