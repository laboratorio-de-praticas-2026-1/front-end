import React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field } from "./field";
import { cn } from "@/lib/utils"; // Importe a função utilitária de classes (comum em Shadcn)

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string; // Adicionado aqui
}

export function DatePicker({ 
  date, 
  setDate, 
  placeholder = "Selecione a data", 
  className // Desestruturado aqui
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    // Usamos o cn() para mesclar a classe padrão com a que vem via props
    <div className={cn("relative w-full", className)}>
      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
      <Field className="w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full justify-start font-normal pl-10 cursor-pointer"
            >
              {date ? date.toLocaleDateString('pt-BR') : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              onSelect={(newDate) => {
                setDate(newDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </div>
  );
}