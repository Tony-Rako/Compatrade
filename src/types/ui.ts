import { ReactNode } from 'react'

// UI Component Props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

// Select Component Types
export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children: ReactNode
}

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export interface SelectContentProps {
  className?: string
  children: ReactNode
  position?: 'item-aligned' | 'popper'
}

export interface SelectItemProps {
  value: string
  className?: string
  children: ReactNode
}

export interface SelectValueProps {
  placeholder?: string
  className?: string
}

// Tabs Component Types
export interface TabsProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
  className?: string
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  asChild?: boolean
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  forceMount?: true
}

// Avatar Component Types
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

// ScrollArea Component Types
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'auto' | 'always' | 'scroll' | 'hover'
}

export interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal'
  forceMount?: true
}

// Toast Types
export interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'default' | 'destructive'
}

export interface ToastActionElement
  extends React.ReactElement<unknown, string | React.ComponentType<unknown>> {
  altText: string
}

export interface ToasterToast {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'default' | 'destructive'
}

export interface State {
  toasts: ToasterToast[]
}

export type ActionType =
  | {
      type: 'ADD_TOAST'
      toast: ToasterToast
    }
  | {
      type: 'UPDATE_TOAST'
      toast: Partial<ToasterToast>
    }
  | {
      type: 'DISMISS_TOAST'
      toastId?: ToasterToast['id']
    }
  | {
      type: 'REMOVE_TOAST'
      toastId?: ToasterToast['id']
    }

export interface UseToastReturn {
  toast: ({ ...props }: Omit<ToasterToast, 'id'>) => {
    id: string
    dismiss: () => void
    update: (props: ToasterToast) => void
  }
  dismiss: (toastId?: string) => void
  toasts: ToasterToast[]
}

// Tooltip Component Types
export interface TooltipProps {
  children: ReactNode
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
}

export interface TooltipTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  avoidCollisions?: boolean
  collisionBoundary?: Element | null
  collisionPadding?:
    | number
    | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  arrowPadding?: number
  sticky?: 'partial' | 'always'
  hideWhenDetached?: boolean
}

// Dialog Component Types
export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  children: ReactNode
}

export interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onInteractOutside?: (event: FocusEvent | MouseEvent | TouchEvent) => void
  forceMount?: true
}

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

// Common utility types
export interface ClassNameProps {
  className?: string
}

export interface ChildrenProps {
  children: ReactNode
}

export type PropsWithClassName<T = {}> = T & {
  className?: string
}

export type PropsWithChildren<T = {}> = T & {
  children: ReactNode
}
