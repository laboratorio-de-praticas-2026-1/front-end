import { useFormContext } from "react-hook-form";
import { Contact } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ContactForm = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    setValue("telefone", value.slice(0, 15), { shouldValidate: true });
  };

  return (
    <Card className="shadow-sm border-gray-200 bg-white">

      <CardHeader className="flex flex-row items-center gap-2 h-[64px] mb-[8px] px-6 border-b border-gray-100 bg-[#F9FAFB]">
        <Contact size={20} className="text-[#001f3f]" />
        <CardTitle className="text-lg font-bold text-[#001f3f]">
          Contato
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 p-6 pb-[34px]">
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-[#001f3f]">
            Telefone <span className="text-[#F15B5B]">*</span>
          </Label>
          <Input
            {...register("telefone")}
            onChange={handlePhoneChange}
            placeholder=""
            className={errors.telefone ? "border-red-500" : "border-gray-300"}
          />
          {errors.telefone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.telefone.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-semibold text-[#001f3f]">
            E-mail <span className="text-[#F15B5B]">*</span>
          </Label>
          <Input
            {...register("email")}
            type="email"
            placeholder=""
            className={errors.email ? "border-red-500" : "border-gray-300"}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-semibold text-[#001f3f]">
            Site <span className="text-[#F15B5B]">*</span>
          </Label>
          <Input
            {...register("site")}
            placeholder=""
            className={errors.site ? "border-red-500" : "border-gray-300"}
          />
          {errors.site && (
            <p className="text-red-500 text-xs mt-1">
              {errors.site.message as string}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};