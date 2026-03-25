import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiImage, FiEye, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";

type Banner = {
  id: string;
  image: string;
  description: string;
  status: "Ativo" | "Inativo";
};

const mockBanners: Banner[] = [
  {
    id: "#001",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    description: "Carros 2026: 5 modelos que vão ganhar as ruas",
    status: "Ativo",
  },
  {
    id: "#002",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80",
    description: "O licenciamento SP 2026 já pode ser feito de maneira simples",
    status: "Inativo",
  },
  {
    id: "#003",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80",
    description: "Como parcelar o IPVA 2026 atrasado",
    status: "Ativo",
  },
];

export function EditCarouselBanner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [banner, setBanner] = useState<Banner | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const decodedId = decodeURIComponent(id);
    const data = mockBanners.find((item) => item.id === decodedId);
    if (data) {
      setBanner(data);
      setImagePreview(data.image);
      setDescription(data.description);
      setIsActive(data.status === "Ativo");
    }
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setImgFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setImagePreview(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Substituir por chamada de API real para edição de banner
    alert("Banner salvo com sucesso!");
    navigate("/admin/carrossel");
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Substituir por chamada de API real para exclusão de banner
    alert("Banner excluído com sucesso!");
    setShowDeleteModal(false);
    navigate("/admin/carrossel");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

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
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Detalhes do banner {banner.id}</h1>
            <p className="text-sm text-zinc-500">Gerencie e atualize as informações deste banner.</p>
          </div>
          <Button
            variant="destructive"
            className="h-11"
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
                <h2 className="font-semibold text-zinc-800">Imagem de destaque</h2>
              </div>
              <div
                className="h-[380px] rounded-lg border border-dashed border-zinc-300 bg-white flex items-center justify-center overflow-hidden relative cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-400 text-center px-4">Clique para inserir uma imagem</span>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="mt-2 text-[12px] text-zinc-400 text-center">Tamanho recomendado: 416x556px (máx. 2MB)</p>
            </section>

            <section className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
              <label className="block text-sm text-zinc-700 mb-2 font-medium">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-zinc-400">Sem imagem</span>
                  )}
                </div>
                <div className="p-3 text-sm text-zinc-600">{description || "Descrição do banner aparecerá aqui."}</div>
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
            className="h-11"
          >
            Cancelar alterações
          </Button>
          <Button onClick={handleSave} className="h-11">
            Salvar banner
          </Button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 text-center border-b border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900">Excluir banner?</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Tem certeza que deseja excluir o banner {banner.id}?<br />
                O banner será removido do fluxo do carrossel imediatamente.
              </p>
            </div>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="outline" onClick={cancelDelete} className="h-10">
                Voltar
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="h-10">
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
