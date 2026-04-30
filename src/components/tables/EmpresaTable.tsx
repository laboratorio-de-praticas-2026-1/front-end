import type { Empresa } from "@/types/empresa.types"; 
import { Edit, Trash2 } from "lucide-react";

interface EmpresaTableProps {
  data: Empresa[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EmpresaTable = ({ data, onEdit, onDelete }: EmpresaTableProps) => {
  return (
    <div className="w-full overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-white uppercase bg-[#001f3f]">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Nome fantasia</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">CNPJ</th>
            <th className="px-4 py-3">Telefone</th>
            <th className="px-4 py-3">Cidade</th>
            <th className="px-4 py-3">Site</th>
            <th className="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data && data.length > 0 ? (
            data.map((empresa) => (
              <tr key={empresa.id} className="bg-white hover:bg-gray-50 transition-colors">

                <td className="px-4 py-3 font-medium text-gray-400">#{empresa.id}</td>
                
                <td className="px-4 py-3 font-normal text-gray-900">{empresa.nomeFantasia}</td>
                <td className="px-4 py-3 text-gray-900">{empresa.tipo}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-900">{empresa.cnpj}</td>
                <td className="px-4 py-3 text-gray-900">{empresa.telefone}</td>
                <td className="px-4 py-3 text-gray-900">{empresa.cidade}</td>
                <td className="px-4 py-3 text-gray-900">{empresa.site}</td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => onEdit(empresa.id)} 
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Editar empresa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(empresa.id)} 
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Excluir empresa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-gray-400 italic">
                Nenhuma empresa encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};