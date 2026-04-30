import { useFormContext } from "react-hook-form";
import { Building2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CompanyDataForm = () => {
  const { 
    register, 
    setValue, 
    formState: { errors } 
  } = useFormContext();

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); 

    value = value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");

    setValue("cnpj", value.slice(0, 18), { shouldValidate: true });
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="flex flex-row items-center gap-2 py-4 px-6 border-b border-gray-100 bg-[#F9FAFB]">
        <Building2 size={20} className="text-[#001f3f]" />
        <CardTitle className="text-lg font-bold text-[#001f3f]">
          Dados da empresa
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-[#001f3f]">
            Nome fantasia <span className="text-[#F15B5B]">*</span>
          </Label>
          <Input 
            {...register("nomeFantasia")} 
            placeholder=""
            className={errors.nomeFantasia ? "border-red-500" : ""}
          />
          {errors.nomeFantasia && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nomeFantasia.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-semibold text-[#001f3f]">
            CNPJ <span className="text-[#F15B5B]">*</span>
          </Label>
          <Input 
            {...register("cnpj")}
            onChange={handleCnpjChange}
            placeholder=""
            className={errors.cnpj ? "border-red-500" : ""}
          />
          {errors.cnpj && (
            <p className="text-red-500 text-xs mt-1">
              {errors.cnpj.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-semibold text-[#001f3f]">
            Tipo de empresa <span className="text-[#F15B5B]">*</span>
          </Label>
          <Select 
            onValueChange={(value) => setValue("tipo", value, { shouldValidate: true })}
          >
            <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            
            <SelectContent className="bg-white z-[50] shadow-md border border-gray-200">
              <SelectItem value="Detran">Detran</SelectItem>
              <SelectItem value="Clínica">Clínica</SelectItem>
              <SelectItem value="Parceiro">Parceiro</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipo && (
            <p className="text-red-500 text-xs mt-1">
              {errors.tipo.message as string}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};