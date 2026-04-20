import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, LockKeyhole, Eye, EyeOff, Save, Trash2 } from "lucide-react";
import { MaskedInput } from "react-text-mask-modern";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const userSchema = z
  .object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    documento: z.string().min(1, "CPF/CNPJ é obrigatório"),
    telefone: z.string().min(1, "Telefone é obrigatório"),
    tipo: z.enum(["Administrador", "Cliente"]),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  mode: "create" | "edit";
  initialData?: Partial<UserFormData> & { id?: string };
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function UserForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  onDelete,
}: UserFormProps) {
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      documento: initialData?.documento || "",
      telefone: initialData?.telefone || "",
      tipo: initialData?.tipo || "Cliente",
      senha: "",
      confirmarSenha: "",
    },
  });

  const tipoSelecionado = watch("tipo");

  const cpfMask = [
    /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/,
  ];

  const cnpjMask = [
    /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/,
  ];

  const phoneMask = [
    "(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/,
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">

      <Card className="border border-gray-200 rounded-lg shadow-sm bg-white">
        <CardHeader className="bg-[#F9FAFB] border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-[#002749]">
            <Info className="h-5 w-5" />
            Informações básicas
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>
                Nome <span className="text-[#EF4444]">*</span>
              </Label>
              <Input {...register("nome")} />
              {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
            </div>

            <div>
              <Label>
                Email <span className="text-[#EF4444]">*</span>
              </Label>
              <Input {...register("email")} />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <Label>
              CPF/CNPJ <span className="text-[#EF4444]">*</span>
            </Label>
            <Controller
              control={control}
              name="documento"
              render={({ field }) => (
                <MaskedInput
                  mask={(value: string) => {
                    const raw = (value || "").replace(/\D/g, "");
                    return raw.length > 11 ? cnpjMask : cpfMask;
                  }}
                  value={field.value || ""}
                  onChange={(e: any) => field.onChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white"
                  placeholder="___.___.___-__"
                />
              )}
            />
          </div>

          <div>
            <Label>
              Telefone <span className="text-[#EF4444]">*</span>
            </Label>
            <Controller
              control={control}
              name="telefone"
              render={({ field }) => (
                <MaskedInput
                  mask={phoneMask}
                  value={field.value || ""}
                  onChange={(e: any) => field.onChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white"
                  placeholder="(99) 99999-9999"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 rounded-lg shadow-sm bg-white">
        <CardHeader className="bg-[#F9FAFB] border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-[#1E84CF]">
            <LockKeyhole className="h-5 w-5 text-[#1E84CF]" />
            Acesso
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div>
            <Label>
              Tipo <span className="text-[#EF4444]">*</span>
            </Label>
            <Select
              value={tipoSelecionado}
              onValueChange={(value) => setValue("tipo", value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="bg-white border border-gray-200 shadow-md">
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              Senha <span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showSenha ? "text" : "password"}
                {...register("senha")}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowSenha(!showSenha)}
              >
                {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <Label>
              Confirmar senha <span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showConfirmar ? "text" : "password"}
                {...register("confirmarSenha")}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowConfirmar(!showConfirmar)}
              >
                {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="link"
          onClick={onCancel}
          className="text-black hover:text-black"
        >
          {isEdit ? "Cancelar alterações" : "Cancelar criação"}
        </Button>

        <Button type="submit" className="bg-[#3b82f6] text-white hover:bg-[#2563eb]">
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? "Salvar usuário" : "Criar usuário"}
        </Button>
      </div>

      {isEdit && onDelete && (
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          className="absolute top-4 right-4"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      )}
    </form>
  );
}