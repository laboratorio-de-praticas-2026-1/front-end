import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { Check, X } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: "#3979A5",
          color: "white",
          border: "1px solid #2689D1",
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl font-sans",
          description: "group-[.toast]:text-blue-100",
          actionButton:
            "group-[.toast]:bg-[#002749] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-zinc-700 group-[.toast]:text-white",
        },
      }}
      icons={{
        success: <Check size={18} className="text-white" />,
        error: <X size={18} className="text-white" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
