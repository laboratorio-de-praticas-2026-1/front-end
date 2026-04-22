import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { File, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

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
  formatSolicitacaoCurrency,
  solicitacaoService,
  type ServicoDisponivel,
} from "@/services/solicitacaoService";

interface ModalNovaSolicitacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId?: number;
  onSucesso?: () => void;
}

export function ModalNovaSolicitacao({
  open,
  onOpenChange,
  usuarioId,
  onSucesso,
}: ModalNovaSolicitacaoProps) {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<ServicoDisponivel[]>([]);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [loadingServicos, setLoadingServicos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    const carregarServicos = async () => {
      try {
        setLoadingServicos(true);
        setErro(null);

        const data = await solicitacaoService.listarServicosDisponiveis();
        if (active) {
          setServicos(data);
        }
      } catch (error) {
        if (active) {
          setErro(
            error instanceof Error
              ? error.message
              : "Nao foi possivel carregar os servicos.",
          );
        }
      } finally {
        if (active) {
          setLoadingServicos(false);
        }
      }
    };

    void carregarServicos();

    return () => {
      active = false;
    };
  }, [open]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.slice(0, 5);
    setArquivos((current) => [...current, ...validFiles].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 5,
    maxSize: 2 * 1024 * 1024,
    multiple: true,
  });

  const limparFormulario = () => {
    setServicoSelecionado("");
    setArquivos([]);
    setErro(null);
  };

  const fecharModal = () => {
    limparFormulario();
    onOpenChange(false);
  };

  const removerArquivo = (index: number) => {
    setArquivos((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSave = async () => {
    if (!usuarioId) {
      setErro(
        "Nao foi possivel identificar o cliente logado. Defina VITE_CLIENTE_USUARIO_ID ou salve o ID do usuario no localStorage.",
      );
      return;
    }

    if (!servicoSelecionado) {
      setErro("Selecione um servico para continuar.");
      return;
    }

    if (arquivos.length > 0) {
      setErro(
        "A API atual ainda nao recebe upload de documentos nesse fluxo. Crie a solicitacao sem anexos por enquanto.",
      );
      return;
    }

    try {
      setSalvando(true);
      setErro(null);

      const response = await solicitacaoService.criarSolicitacao({
        usuario_id: usuarioId,
        servico_id: Number(servicoSelecionado),
        veiculo_id: null,
      });

      onSucesso?.();
      fecharModal();

      navigate("/cliente/solicitacoes/sucesso", {
        state: {
          solicitacaoCriada: {
            mensagem: response.message,
            servico: response.protocolo.servico.nome,
            valorBase: response.protocolo.servico.valor_base,
            dataSolicitacao: response.protocolo.solicitacao.data_solicitacao,
            prazoEstimado: response.protocolo.solicitacao.prazo_estimado,
            clienteNome: response.protocolo.cliente.nome,
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Nova solicitacao
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Selecione o servico e envie a solicitacao para o backend.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="servico" className="text-sm font-medium text-gray-700">
              Servico
            </Label>
            <Select value={servicoSelecionado} onValueChange={setServicoSelecionado}>
              <SelectTrigger
                id="servico"
                className="w-full border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                  <SelectItem key={servico.id} value={String(servico.id)}>
                    <div className="flex w-full items-center justify-between gap-4">
                      <span>{servico.nome}</span>
                      <span className="text-xs text-gray-500">
                        {formatSolicitacaoCurrency(servico.valorBase)}
                      </span>
                    </div>
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
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-2 h-10 w-10 text-gray-500" />
              {isDragActive ? (
                <p className="text-sm text-gray-700">Solte os arquivos aqui...</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    Arraste arquivos aqui
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ou clique para buscar. Maximo de 5 arquivos com ate 2MB cada.
                  </p>
                </>
              )}
            </div>

            {arquivos.length > 0 && (
              <div className="mt-3 space-y-2">
                {arquivos.map((arquivo, index) => (
                  <div
                    key={`${arquivo.name}-${index}`}
                    className="flex items-center justify-between rounded-md bg-gray-100 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="max-w-[220px] truncate text-sm text-gray-700">
                        {arquivo.name}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removerArquivo(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500">
              O upload sera liberado assim que o endpoint aceitar anexos nesse
              fluxo do cliente.
            </p>
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={fecharModal}
            className="w-full bg-white hover:bg-gray-100 sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={salvando || loadingServicos}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
