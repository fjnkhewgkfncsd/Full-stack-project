import clsx from "clsx";
import { AlertCircle } from "lucide-react";

export function Alert({ className, children, variant = "default", ...props }) {
  return (
    <div className={clsx(
      "flex items-start gap-3 p-4 rounded-md",
      variant === "default" && "bg-blue-50 text-blue-800",
      variant === "destructive" && "bg-red-50 text-red-800",
      className
    )} {...props}>
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );
}