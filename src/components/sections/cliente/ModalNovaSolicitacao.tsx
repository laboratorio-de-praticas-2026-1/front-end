import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { File, Upload, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  solicitacaoService,
  type ServicoDisponivel,
} from "@/services/solicitacaoService";

interface ModalNovaSolicitacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId: number;
  onSucesso?: () => void;
}

export function ModalNovaSolicitacao({
  open,
  onOpenChange,
  usuarioId,
  onSucesso,
}: ModalNovaSolicitacaoProps) {
  const navigate = useNavigate();
  const [veiculoSelecionado, setVeiculoSelecionado] = useState("");
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [servicos, setServicos] = useState<ServicoDisponivel[]>([]);
  const [loadingServicos, setLoadingServicos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let ativo = true;

    async function carregarServicos() {
      setLoadingServicos(true);
      setErro(null);

      try {
        const data = await solicitacaoService.listarServicosDisponiveis();
        if (ativo) {
          setServicos(data);
        }
      } catch {
        if (ativo) {
          setErro("Nao foi possivel carregar os servicos.");
        }
      } finally {
        if (ativo) {
          setLoadingServicos(false);
        }
      }
    }

    void carregarServicos();

    return () => {
      ativo = false;
    };
  }, [open]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.slice(0, 5);
    setArquivos((prev) => [...prev, ...validFiles].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 2 * 1024 * 1024,
    multiple: true,
  });

  function limparFormulario() {
    setVeiculoSelecionado("");
    setServicoSelecionado("");
    setArquivos([]);
    setErro(null);
  }

  function removerArquivo(index: number) {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCancel() {
    limparFormulario();
    onOpenChange(false);
  }

  async function handleSave() {
    if (!servicoSelecionado) {
      setErro("Selecione um servico para continuar.");
      return;
    }

    if (arquivos.length > 0) {
      setErro("Nao foi possivel enviar arquivos com a API atual.");
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      const resultado = await solicitacaoService.criar({
        usuario_id: usuarioId,
        servico_id: Number(servicoSelecionado),
        veiculo_id: null,
      });

      onSucesso?.();
      limparFormulario();
      onOpenChange(false);

      navigate("/cliente/solicitacoes/sucesso", {
        state: {
          solicitacaoCriada: {
            mensagem: resultado.message,
            servico: resultado.protocolo.servico.nome,
            valorBase: resultado.protocolo.servico.valor_base,
            dataSolicitacao: resultado.protocolo.solicitacao.data_solicitacao,
            prazoEstimado: resultado.protocolo.solicitacao.prazo_estimado,
            clienteNome: resultado.protocolo.cliente.nome,
          },
        },
      });
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel criar a solicitacao.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Nova solicitacao
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Selecione o veiculo e o servico desejado
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="veiculo" className="text-sm font-medium text-gray-700">
              Veiculo
            </Label>
            <Select
              value={veiculoSelecionado}
              onValueChange={setVeiculoSelecionado}
              disabled
            >
              <SelectTrigger
                id="veiculo"
                className="w-full border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <SelectValue placeholder="Veiculos ainda nao disponiveis na API" />
              </SelectTrigger>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="servico" className="text-sm font-medium text-gray-700">
              Servico
            </Label>
            <Select value={servicoSelecionado} onValueChange={setServicoSelecionado}>
              <SelectTrigger
                id="servico"
                className="w-full border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <SelectValue
                  placeholder={
                    loadingServicos
                      ? "Carregando servicos..."
                      : "Selecione um servico"
                  }
                />
              </SelectTrigger>
              <SelectContent className="border-gray-200 bg-white">
                {servicos.map((servico) => (
                  <SelectItem
                    key={servico.id}
                    value={String(servico.id)}
                    className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {servico.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700">Documentos</Label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed bg-gray-50 p-6 text-center transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-2 h-10 w-10 text-gray-500" />
              {isDragActive ? (
                <p className="text-sm text-gray-700">Solte os arquivos aqui...</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    Arraste e solte arquivos aqui
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ou clique para buscar (max. 5 arquivos, ate 2MB cada)
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    Buscar arquivos
                  </Button>
                </>
              )}
            </div>

            {arquivos.length > 0 && (
              <div className="mt-3 space-y-2">
                {arquivos.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between rounded-md bg-gray-100 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="max-w-[200px] truncate text-sm text-gray-700">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500"
                      onClick={() => removerArquivo(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500">Maximo de 2MB por arquivo</p>
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={salvando || loadingServicos}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 sm:w-auto"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
