import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ConfirmDeleteModalFaqProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  title?: string
  description?: React.ReactNode
}

export function ConfirmDeleteModalFaq({
  open,
  onOpenChange,
  onConfirm,
  title = "Excluir item?",
  description = "Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita."
}: ConfirmDeleteModalFaqProps) {
  
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()

      toast.success("Excluído com sucesso!")
      onOpenChange(false)

    } catch (error) {

      const message = error instanceof Error ? error.message : "Erro ao excluir. Tente novamente.";
      toast.error(message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[85vw] sm:max-w-[420px] rounded-lg [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        
        <DialogHeader className="flex flex-col gap-2 text-left">
          <DialogTitle className="font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-none"
          >
            Voltar
          </Button>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  )
}