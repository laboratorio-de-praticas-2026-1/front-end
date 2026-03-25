"use client"
import { useNavigate } from "react-router-dom"

import { useState } from "react" 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SquarePen, Trash2, ChevronRight, ArrowUpDown, Loader2 } from "lucide-react"

export interface Post {
  id: number
  imagem?: string
  titulo: string
  conteudo: string
  dataPublicacao: string
}

interface BlogTableProps {
  posts: Post[]
  carregando: boolean
}

export default function BlogTable({ posts, carregando }: BlogTableProps) {

  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const postsPerPage = 7

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.dataPublicacao.split('/').reverse().join('-')).getTime()
    const dateB = new Date(b.dataPublicacao.split('/').reverse().join('-')).getTime()

    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage) || 1
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost)

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    setCurrentPage(1)
  }

  const getPaginationItems = () => {
    const items = []
    const maxVisiblePages = 3
    let startPage = Math.max(1, currentPage - 1)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(i)
    }
    return items
  }

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-500 bg-white rounded-xl shadow-sm border border-zinc-200 min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Buscando postagens reais no banco de dados...</p>
      </div>
    )
  }

  if (!carregando && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-500 bg-white rounded-xl shadow-sm border border-zinc-200 min-h-[400px]">
        <p className="text-lg font-medium text-zinc-800">Nenhum post encontrado</p>
        <p className="text-sm">As postagens aparecerão aqui quando o back-end enviar algo.</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead className="text-white font-medium">ID</TableHead>
            <TableHead className="text-white font-medium">Imagem</TableHead>
            <TableHead className="text-white font-medium">Título</TableHead>
            <TableHead className="text-white font-medium">Conteúdo</TableHead>
            
            <TableHead 
              className="text-white font-medium text-center cursor-pointer hover:bg-secondary/90 transition-colors"
              onClick={toggleSort}
            >
              <div className="flex items-center justify-center gap-1">
                Data de publicação
                <ArrowUpDown size={14} className={sortOrder === 'asc' ? "opacity-100" : "opacity-50"} />
              </div>
            </TableHead>

            <TableHead className="text-white font-medium text-right px-6">Ações</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody className="border border-zinc-200">
          {currentPosts.map((post) => (
            <TableRow key={post.id} className="hover:bg-zinc-50 border-b border-zinc-100 bg-white">
              <TableCell className="text-muted-foreground font-medium">{post.id}</TableCell>
              <TableCell>
                {/* Ajuste para lidar com posts sem imagem que podem vir do banco */}
                {post.imagem ? (
                   <img src={post.imagem} alt="Thumb" className="w-20 h-14 object-cover rounded-md shadow-sm" />
                ) : (
                   <div className="w-20 h-14 bg-zinc-100 rounded-md border border-zinc-200 flex items-center justify-center text-xs text-zinc-400">Sem Foto</div>
                )}
              </TableCell>
              <TableCell className="font-medium text-foreground truncate max-w-[200px]">{post.titulo}</TableCell>
              <TableCell className="text-zinc-500 text-sm truncate max-w-[250px]">{post.conteudo}</TableCell>

              {/* Ajustado para dataPublicacao */}
              <TableCell className="text-zinc-600 text-sm text-center">{post.dataPublicacao}</TableCell>
              <TableCell className="text-right px-6">
                <div className="flex justify-end gap-2">
                  <button 
                  onClick={() => navigate(`/admin/posts/editar/${post.id}`)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer"><SquarePen size={18} />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={18} /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Footer Paginação com as cores ajustadas para o tema */}
      <div className="py-4 grid grid-cols-3 items-center border-t border-zinc-100 px-6">
        <div></div>
        <div className="flex items-center justify-center gap-2 text-sm text-secondary">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="hover:text-primary font-medium disabled:opacity-30 cursor-pointer transition-all px-2"
          >
            Anterior
          </button>
          
          <div className="flex items-center gap-1">
            {getPaginationItems().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all font-medium ${
                  currentPage === page 
                    ? "bg-primary text-white shadow-sm" 
                    : "hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                }`}
              >
                {page}
              </button>
            ))}
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <span className="px-1 text-zinc-400">...</span>
            )}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="disabled:opacity-30 cursor-pointer transition-all flex items-center font-medium hover:text-primary px-2"
          >
            Próxima <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="text-sm text-zinc-500 text-right hidden sm:block">
          {posts.length} {posts.length === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>
    </div>
  )
}