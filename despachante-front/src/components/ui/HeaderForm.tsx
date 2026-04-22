import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = {
  placa: string;
  email: string;
};

export default function HeaderForm() {
  const form = useForm<FormData>({
    defaultValues: {
      placa: "",
      email: "",
    },
  });

  const onSubmit = (_data: FormData) => {
    alert("Formulario enviado!");
  };

  return (
    <Form {...form}>
      <form
        className="bg-muted flex h-auto w-[95%] flex-col items-center gap-4 rounded-3xl p-6 sm:w-[416px]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="mt-2 mb-4 text-center text-lg font-normal text-foreground">
          Consulte em poucos minutos!
        </h2>

        <FormField
          control={form.control}
          name="placa"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite sua placa"
                  {...field}
                  className="h-11 w-full border border-input bg-background focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  {...field}
                  className="mb-2 h-11 w-full bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="h-12 w-full rounded-full text-lg hover:bg-secondary"
          type="submit"
          variant="default"
        >
          Continuar
        </Button>
      </form>
    </Form>
  );
}
