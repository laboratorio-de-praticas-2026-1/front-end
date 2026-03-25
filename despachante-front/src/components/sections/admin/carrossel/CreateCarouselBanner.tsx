import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiImage, FiEye, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { carouselService } from "@/services/carrosselService";

export function CreateCarouselBanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const arquivosSelecionados = Array.from(event.target.files);
    setBannerFiles((prev) => [...prev, ...arquivosSelecionados]);

    arquivosSelecionados.forEach((arquivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setBannerImages((prev) => [...prev, e.target?.result as string]);
        }
      };
      reader.readAsDataURL(arquivo);
    });

    // Permite selecionar o mesmo arquivo em cliques consecutivos.
    event.target.value = "";
  };

  const removeSelectedImage = (index: number) => {
    setBannerFiles((prev) => prev.filter((_, i) => i !== index));
    setBannerImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (bannerFiles.length === 0 || !description.trim()) {
      alert("Selecione ao menos uma imagem e preencha a descrição para criar os banners.");
      return;
    }

    setSaving(true);

    try {
      await Promise.all(
        bannerFiles.map((file) => {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("description", description.trim());
          formData.append("status", isActive ? "Ativo" : "Inativo");
          return carouselService.criar(formData);
        })
      );

      alert(`${bannerFiles.length} banner(s) criado(s) com sucesso!`);
      navigate("/admin/carrossel");
    } catch (error) {
      console.error(error);
      alert("Falha ao salvar os banners, tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-zinc-200">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Criar novo banner</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Preencha os campos abaixo para configurar e publicar seu banner no carrossel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 md:p-8">
          {/* Imagem + descrição */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiImage size={18} className="text-blue-600" />
                <h2 className="font-semibold text-zinc-800">Imagens do carrossel</h2>
              </div>

              <div
                className="h-72 rounded-lg border border-dashed border-zinc-300 bg-white flex items-center justify-center cursor-pointer overflow-hidden relative"
                onClick={() => fileInputRef.current?.click()}
              >
                {bannerImages.length > 0 ? (
                  <img src={bannerImages[0]} alt="Banner preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-zinc-400 text-center px-6">
                    <p className="font-semibold">Clique para selecionar uma ou mais imagens</p>
                    <p className="text-xs mt-1">Tamanho recomendado: 416x556px (máx. 2MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              {bannerImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-zinc-500 mb-2">{bannerImages.length} imagem(ns) selecionada(s)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {bannerImages.map((image, index) => (
                      <div key={`${image}-${index}`} className="relative h-20 rounded-md overflow-hidden border border-zinc-200">
                        <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeSelectedImage(index);
                          }}
                          className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded px-1.5 py-0.5"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <label className="block text-sm text-zinc-700 mb-1 font-medium">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-zinc-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Ex: Licenciamento SP 2026 já está disponível"
              />
            </div>
          </div>

          {/* Pré-visualização e status */}
          <div className="space-y-6">
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiEye size={18} className="text-blue-600" />
                <h2 className="font-semibold text-zinc-800">Pré-visualização</h2>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
                <div className="h-48 bg-zinc-100 flex items-center justify-center">
                  {bannerImages.length > 0 ? (
                    <img src={bannerImages[0]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-zinc-400">Sem imagem selecionada</span>
                  )}
                </div>
                <div className="p-3 text-sm text-zinc-600">{description || "Descrição do banner aparecerá aqui."}</div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-zinc-700 font-semibold">
                  <FiCheckCircle size={16} />
                  <span>Status do banner</span>
                </div>
                <p className="text-xs text-zinc-500">Banners inativos não aparecem no carrossel.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive((prev) => !prev)}
                  className="sr-only"
                />
                <span
                  className={`w-12 h-7 rounded-full transition-colors ${
                    isActive ? "bg-blue-600" : "bg-zinc-300"
                  }`}
                />
                <span
                  className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-zinc-200">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-lg h-11"
          >
            Cancelar criação
          </Button>

          <Button
            onClick={handleCreate}
            disabled={saving}
            className="rounded-lg h-11"
          >
            Criar banner
          </Button>
        </div>
      </div>
    </div>
  );
}
