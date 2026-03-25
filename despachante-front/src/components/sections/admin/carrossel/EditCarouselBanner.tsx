import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiImage, FiEye, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { carouselService } from "@/services/carrosselService";
import type { CarouselBanner } from "@/services/carrosselService";

export function EditCarouselBanner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [banner, setBanner] = useState<CarouselBanner | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [descricao, setDescricao] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const carregarBanner = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const parsedId = Number(decodeURIComponent(id));
      if (Number.isNaN(parsedId)) {
        setLoading(false);
        return;
      }

      try {
        const data = await carouselService.buscarPorId(parsedId);
        if (data) {
          setBanner(data);
          setImagePreviews([data.urlImagem]);
          setDescricao(data.descricao);
          setIsActive(data.ativo);
        }
      } catch (error) {
        console.error("Erro ao carregar banner:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarBanner();
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const arquivosSelecionados = Array.from(event.target.files);
    setImgFiles((prev) => [...prev, ...arquivosSelecionados]);

    arquivosSelecionados.forEach((arquivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        }
      };
      reader.readAsDataURL(arquivo);
    });

    event.target.value = "";
  };

  const removeSelectedImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImgFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!banner) return;

    if (!descricao.trim()) {
      alert("Preencha a descrição do banner.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("descricao", descricao.trim());
      formData.append("ativo", isActive ? "true" : "false");

      if (imgFiles[0]) {
        formData.append("imagem", imgFiles[0]);
      }

      await carouselService.atualizar(banner.id, formData);
      alert("Banner salvo com sucesso!");
      navigate("/admin/carrossel");
    } catch (error) {
      console.error("Erro ao salvar banner:", error);
      alert("Não foi possível salvar o banner.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!banner) return;

    setDeleting(true);
    try {
      await carouselService.deletar(banner.id);
      alert("Banner excluído com sucesso!");
      setShowDeleteModal(false);
      navigate("/admin/carrossel");
    } catch (error) {
      console.error("Erro ao excluir banner:", error);
      alert("Não foi possível excluir o banner.");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 text-center">
          <p className="text-zinc-600">Carregando banner...</p>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 text-center">
          <p className="text-zinc-600">Banner não encontrado.</p>
          <Button onClick={() => navigate("/admin/carrossel")} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-zinc-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Detalhes do banner #{banner.id}</h1>
            <p className="text-sm text-zinc-500">Gerencie e atualize as informações deste banner.</p>
          </div>
          <Button
            variant="destructive"
            className="h-11 shadow-sm transition-transform hover:scale-105"
            onClick={handleDelete}
          >
            <FiTrash2 className="mr-2" /> Excluir
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 md:p-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiImage size={18} className="text-blue-600" />
                <h2 className="font-semibold text-zinc-800">Imagens do carrossel</h2>
              </div>
              <div
                className="h-[380px] rounded-lg border border-dashed border-zinc-300 bg-white flex items-center justify-center overflow-hidden relative cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreviews.length > 0 ? (
                  <img src={imagePreviews[0]} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-400 text-center px-4">Clique para inserir uma ou mais imagens</span>
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

              {imagePreviews.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-zinc-500 mb-2">{imagePreviews.length} imagem(ns) selecionada(s)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {imagePreviews.map((image, index) => (
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
              <p className="mt-2 text-[12px] text-zinc-400 text-center">Tamanho recomendado: 416x556px (máx. 2MB)</p>
            </section>

            <section className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <label className="block text-sm text-zinc-700 mb-2 font-medium">Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-zinc-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiEye size={18} className="text-blue-600" />
                <h2 className="font-semibold text-zinc-800">Pré-visualização</h2>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
                <div className="h-48 bg-zinc-100 flex items-center justify-center">
                  {imagePreviews.length > 0 ? (
                    <img src={imagePreviews[0]} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-zinc-400">Sem imagem</span>
                  )}
                </div>
                <div className="p-3 text-sm text-zinc-600">{descricao || "Descrição do banner aparecerá aqui."}</div>
              </div>
            </section>

            <section className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center gap-3 justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-700">Status do banner</p>
                  <p className="text-xs text-zinc-500">Banners inativos não aparecem no carrossel.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive((v) => !v)}
                    className="sr-only"
                  />
                  <span className={`w-12 h-7 rounded-full transition-colors ${isActive ? "bg-blue-600" : "bg-zinc-300"}`} />
                  <span className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0"}`} />
                </label>
              </div>
            </section>
          </aside>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-zinc-200">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/carrossel")}
            disabled={saving}
            className="h-11 shadow-sm transition-transform hover:scale-105"
          >
            Cancelar alterações
          </Button>
          <Button onClick={handleSave} disabled={saving} className="h-11 shadow-sm transition-transform hover:scale-105 bg-primary hover:bg-primary">
            Salvar Carrossel
          </Button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 text-center border-b border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900">Excluir banner?</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Tem certeza que deseja excluir o banner #{banner.id}?<br />
                O banner será removido do fluxo do carrossel imediatamente.
              </p>
            </div>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="outline" onClick={cancelDelete} className="h-10" disabled={deleting}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="h-10" disabled={deleting}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}