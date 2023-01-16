import * as React from "react";
import Toast from "../components/Toast";

export enum ToastTypes {
  SUCCESS = 1,
  WARNING = 2,
  ERROR = 3,
}

type ToastProps = {
  message: string;
  duration?: number;
  type: ToastTypes;
  visible?: boolean;
};

const defaultToastProps: ToastProps = {
  message: "",
  type: ToastTypes.SUCCESS,
  duration: 6000,
  visible: false,
};

interface IToastProvider {
  children?: JSX.Element | JSX.Element[];
}

export interface ToastContextState {
  toast: ToastProps;
  showToast: (props: ToastProps) => void;
  hideToast: () => void;
}

export const ToastContext = React.createContext<ToastContextState | undefined>(
  undefined
);

const ToastProvider = ({ children }: IToastProvider) => {
  const [toast, setToast] = React.useState<ToastProps>(defaultToastProps);

  const showToast = (props: ToastProps): void => {
    setToast({ ...props, visible: true });
  };

  const hideToast = (): void => {
    setToast((toast) => ({ ...toast, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
      <div className="flex w-full justify-center">
        <Toast />
      </div>
    </ToastContext.Provider>
  );
};

export { ToastProvider };
