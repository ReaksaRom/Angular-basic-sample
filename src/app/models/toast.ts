export interface ToastAction {
    label: string;
    type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    handler: () => void;
}

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'primary';
    title: string;
    message: string;
    duration?: number;
    autoDismiss?: boolean;
    position?: 'top-right' | 'top-center' | 'bottom-right';
    progress?: number;
    actions?: ToastAction[];
    timestamp: number;
}