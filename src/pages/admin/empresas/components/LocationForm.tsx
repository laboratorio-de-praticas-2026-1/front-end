import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LocationForm = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Força os campos a ficarem vazios na montagem do componente
  useEffect(() => {
    setValue("latitude", "");
    setValue("longitude", "");
  }, [setValue]);

  return (
    <Card className="shadow-sm border-gray-200 bg-white">
      {/* Ajustado para h-[72px] e items-center. 
        Agora a linha (border-b) vai estar exatamente no mesmo lugar que a do card do Mapa.
      */}
      <CardHeader className="flex flex-row items-center gap-2 h-[72px] px-6 border-b border-gray-100 bg-[#F9FAFB]">
        <MapPin size={20} className="text-[#001f3f]" />
        <CardTitle className="text-lg font-bold text-[#001f3f]">
          Localização
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 p-6">
        {/* Endereço */}
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-[#001f3f]">
            Endereço <span className="text-[#F15B5B]">*</span>
          </Label>
          <Input
            {...register("endereco")}
            placeholder=""
            className={errors.endereco ? "border-red-500" : "border-gray-300"}
          />
          {errors.endereco && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endereco.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cidade */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-[#001f3f]">
              Cidade <span className="text-[#F15B5B]">*</span>
            </Label>
            <Input
              {...register("cidade")}
              placeholder=""
              className={errors.cidade ? "border-red-500" : "border-gray-300"}
            />
            {errors.cidade && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cidade.message as string}
              </p>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-[#001f3f]">
              Estado <span className="text-[#F15B5B]">*</span>
            </Label>
            <Input
              {...register("estado")}
              placeholder=""
              className={errors.estado ? "border-red-500" : "border-gray-300"}
            />
            {errors.estado && (
              <p className="text-red-500 text-xs mt-1">
                {errors.estado.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Latitude */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-[#001f3f]">
              Latitude <span className="text-[#F15B5B]">*</span>
            </Label>
            <Input
              type="text"
              {...register("latitude")}
              placeholder=""
              className={errors.latitude ? "border-red-500" : "border-gray-300"}
            />
            {errors.latitude && (
              <p className="text-red-500 text-xs mt-1">
                {errors.latitude.message as string}
              </p>
            )}
          </div>

          {/* Longitude */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-[#001f3f]">
              Longitude <span className="text-[#F15B5B]">*</span>
            </Label>
            <Input
              type="text"
              {...register("longitude")}
              placeholder=""
              className={errors.longitude ? "border-red-500" : "border-gray-300"}
            />
            {errors.longitude && (
              <p className="text-red-500 text-xs mt-1">
                {errors.longitude.message as string}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};