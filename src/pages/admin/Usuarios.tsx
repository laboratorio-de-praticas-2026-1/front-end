import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpDown,
  SquarePen,
  Trash2,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DatePicker } from '@/components/ui/DatePicker';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { usuarioService } from '@/services/usuarioService';

type User = {
  id: number;
  nome: string;
  email: string;
  nivel: 'Administrador' | 'Cliente' | 'Nível 3';
  dataCadastro: Date;
};

const ITEMS_PER_PAGE = 7;

export default function Usuarios() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const [nivelFilter, setNivelFilter] = useState<string>('');
  const [dataFilter, setDataFilter] = useState<Date | undefined>(undefined);
  const [searchText, setSearchText] = useState<string>('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  type SortKey = 'nivel' | 'dataCadastro';
  const [sortKey, setSortKey] = useState<SortKey>('dataCadastro');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let ativo = true;

    const carregarUsuarios = async () => {
      const dados = await usuarioService.buscarPorFiltros({
        nivel: nivelFilter,
        dataCadastro: dataFilter,
      });

      if (ativo) {
        setUsers(dados);
        setCurrentPage(1);
      }
    };

    carregarUsuarios();

    return () => {
      ativo = false;
    };
  }, [nivelFilter, dataFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    if (searchText.trim() !== '') {
      const term = searchText.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.nome.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [users, nivelFilter, dataFilter, searchText]);

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    if (sortKey === 'nivel') {
      sorted.sort((a, b) => {
        const ordem = a.nivel.localeCompare(b.nivel);
        return sortDirection === 'asc' ? ordem : -ordem;
      });
    } else if (sortKey === 'dataCadastro') {
      sorted.sort((a, b) => {
        const ordem = a.dataCadastro.getTime() - b.dataCadastro.getTime();
        return sortDirection === 'asc' ? ordem : -ordem;
      });
    }
    return sorted;
  }, [filteredUsers, sortKey, sortDirection]);

  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleClearFilters = () => {
    setNivelFilter('');
    setDataFilter(undefined);
    setSearchText('');
    setCurrentPage(1);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    setDeleteLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Remove o usuário da lista
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
      setDeleteModalOpen(false);
      
      // Se a página atual ficar vazia, volta uma página
      const newTotalItems = users.length - 1;
      const newTotalPages = Math.ceil(newTotalItems / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    } finally {
      setDeleteLoading(false);
      setSelectedUser(null);
    }
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const DualSortIcon = ({ column }: { column: SortKey }) => {
    const isActive = sortKey === column;
    return (
      <ArrowUpDown
        className={`ml-2 h-5 w-5 ${isActive ? 'text-white' : 'text-white/50'}`}
      />
    );
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(i)}
            className={`text-[#002749] hover:bg-transparent ${currentPage === i ? 'bg-gray-100 rounded' : ''}`}
          >
            {i}
          </Button>
        );
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        buttons.push(
          <Button
            key={i}
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(i)}
            className={`text-[#002749] hover:bg-transparent ${currentPage === i ? 'bg-gray-100 rounded' : ''}`}
          >
            {i}
          </Button>
        );
      }
      buttons.push(<span key="ellipsis" className="px-2 text-[#002749]">...</span>);
    }
    
    return buttons;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground text-sm">
            Visualize, crie, organize e acompanhe todos os usuários do seu site.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/usuarios/novo')}>
          + Novo usuário
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border p-4 bg-white">
        <div className="w-48">
          <Select value={nivelFilter} onValueChange={setNivelFilter}>
            <SelectTrigger className="bg-white text-black [&>span]:opacity-100">
              <SelectValue placeholder="Nível do usuário" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Cliente">Cliente</SelectItem>
              <SelectItem value="Nível 3">Nível 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <DatePicker
            date={dataFilter}
            setDate={setDataFilter}
            placeholder="Data de cadastro"
            className="text-muted-foreground" 
          />
        </div>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou e-mail..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Button
          onClick={handleClearFilters}
          variant="secondary"
          className="bg-[#E5E7EA] text-black hover:bg-[#d1d5db]"
        >
          Limpar filtros
        </Button>
      </div>

      <div className="rounded-md border-gray-300 border bg-white">
        <Table>
          <TableHeader className="bg-[#002749]">
            <TableRow>
              <TableHead className="w-20 text-white">ID</TableHead>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">E-mail</TableHead>
              <TableHead className="cursor-pointer text-white" onClick={() => toggleSort('nivel')}>
                <div className="flex items-center">
                  Nível
                  <DualSortIcon column="nivel" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-white" onClick={() => toggleSort('dataCadastro')}>
                <div className="flex items-center">
                  Data de cadastro
                  <DualSortIcon column="dataCadastro" />
                </div>
              </TableHead>
              <TableHead className="w-24 text-center text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Nenhum usuário encontrado.</TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm text-gray-500">#{String(user.id).padStart(3, '0')}</TableCell>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.nivel}</TableCell>
                  <TableCell>{user.dataCadastro.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                        onClick={() => navigate(`/admin/usuarios/editar/${user.id}`)}
                      >
                        <SquarePen className="h-5 w-5" />
                      </button>
                      <button
                        className="text-[#ef4444] hover:text-[#dc2626] transition-colors"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="text-[#002749] hover:bg-transparent disabled:opacity-50"
              >
                Previous
              </Button>
              {renderPaginationButtons()}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-[#002749] hover:bg-transparent disabled:opacity-50"
              >
                Next &gt;
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {totalItems} resultado{totalItems !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {selectedUser && (
        <ConfirmDeleteModal
          open={deleteModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          userName={selectedUser.nome}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}