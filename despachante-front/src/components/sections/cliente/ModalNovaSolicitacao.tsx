import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, X, File } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const veiculosMock = [
  { id: "1", nome: "Fiat Uno Mille 2010 - Placa ABC-1234" },
  { id: "2", nome: "VW Gol G5 2015 - Placa DEF-5678" },
  { id: "3", nome: "Chevrolet Onix 2020 - Placa GHI-9012" },
];

const servicosMock = [
  { id: "1", nome: "Transferência de veículo" },
  { id: "2", nome: "Licenciamento anual" },
  { id: "3", nome: "Segunda via do CRV" },
  { id: "4", nome: "Vistoria veicular" },
];

interface ModalNovaSolicitacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalNovaSolicitacao({ open, onOpenChange }: ModalNovaSolicitacaoProps) {
  const navigate = useNavigate();
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string>("");
  const [servicoSelecionado, setServicoSelecionado] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.slice(0, 5);
    setFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 2 * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setVeiculoSelecionado("");
    setServicoSelecionado("");
    setFiles([]);
    onOpenChange(false);
  };

  const handleSave = () => {
    navigate("/cliente/solicitacoes/sucesso");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Nova solicitação</DialogTitle>
          <p className="text-sm text-gray-600">
            Selecione o veículo e o serviço desejado
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-4">
          {/* Veículo */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="veiculo" className="text-sm font-medium text-gray-700">Veículo</Label>
            <Select value={veiculoSelecionado} onValueChange={setVeiculoSelecionado}>
              <SelectTrigger id="veiculo" className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {veiculosMock.map((veiculo) => (
                  <SelectItem key={veiculo.id} value={veiculo.id} className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                    {veiculo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Serviço */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="servico" className="text-sm font-medium text-gray-700">Serviço</Label>
            <Select value={servicoSelecionado} onValueChange={setServicoSelecionado}>
              <SelectTrigger id="servico" className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {servicosMock.map((servico) => (
                  <SelectItem key={servico.id} value={servico.id} className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                    {servico.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Documentos - Upload estilizado */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700">Documentos</Label>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors bg-gray-50
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 p-2.5">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-700">Enviar arquivos</p>
                <p className="text-xs text-gray-500">
                  ou clique para buscar (máx. 5 arquivos, até 2MB cada)
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-3 bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
                Buscar arquivos
              </Button>
            </div>

            {/* Lista de arquivos */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500"
                      onClick={() => removeFile(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}