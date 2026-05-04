import { toast } from "react-toastify";

export const notify = {
  success: (msg) =>
    toast.success(msg),

  error: (msg) =>
    toast.error(msg || "Something went wrong"),

  info: (msg) =>
    toast.info(msg),

  warning: (msg) =>
    toast.warning(msg),

  promise: (promise, messages) =>
    toast.promise(promise, {
      pending: messages.pending || "Processing...",
      success: messages.success || "Success",
      error: messages.error || "Failed",
    }),
};
