"use client";

import { Toast } from "@base-ui/react/toast";
import { CheckIcon, XIcon } from "lucide-react";

export const toastManager = Toast.createToastManager();
const ToastList = () => {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Viewport className="fixed inset-x-4 top-4 z-[100] mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-col gap-2 outline-none">
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          toast={toast}
          className="flex items-center gap-2 rounded-lg border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-lg transition-[opacity,transform] data-[limited]:hidden data-[starting-style]:-translate-y-2 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none"
        >
          <CheckIcon className="size-4 shrink-0" />
          <Toast.Content>
            <Toast.Title />
            <Toast.Description />
          </Toast.Content>
          <Toast.Close
            aria-label="Dismiss notification"
            className="ml-2 rounded-sm p-1 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <XIcon className="size-3" />
          </Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
};
export const Toaster = () => (
  <Toast.Provider toastManager={toastManager}>
    <Toast.Portal>
      <ToastList />
    </Toast.Portal>
  </Toast.Provider>
);
