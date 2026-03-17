"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SquarePen, Trash2, ChevronRight, ArrowUpDown } from "lucide-react"

import mockData from "@/mocks/mockPost.json"

interface Post {
  id: string
  imagem: string
  titulo: string
  conteudo: string
  data_publicacao: string
}

export default function BlogTable() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc') // Estado para a ordem
  const postsPerPage = 7

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(mockData)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Lógica de Ordenação (deve vir antes do slice)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.data_publicacao.split('/').reverse().join('-')).getTime()
    const dateB = new Date(b.data_publicacao.split('/').reverse().join('-')).getTime()

    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })

  // Lógica de Paginação baseada nos posts ordenados
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost)

  // Função para alternar a ordem
  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    setCurrentPage(1) // Volta para a página 1 ao ordenar
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

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>

  return (
    <div className="w-9/10  rounded-lg overflow-hidden mx-auto">
      <Table>
        <TableHeader className="bg-[#3b4b89]">
          <TableRow>
            <TableHead className="text-white font-medium">ID</TableHead>
            <TableHead className="text-white font-medium">Imagem</TableHead>
            <TableHead className="text-white font-medium">Título</TableHead>
            <TableHead className="text-white font-medium">Conteúdo</TableHead>
            
            {/* 3. Header clicável para ordenação */}
            <TableHead 
              className="text-white font-medium text-center cursor-pointer hover:bg-[#2d3a6d] transition-colors"
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
        
        <TableBody className="border border-gray-200">
          {currentPosts.map((post) => (
            <TableRow key={post.id} className="hover:bg-slate-50 border-b border-gray-100 bg-white">
              <TableCell className="text-muted-foreground font_regular">{post.id}</TableCell>
              <TableCell>
                <img src={post.imagem} alt="Thumb" className="w-28 h-17 object-cover rounded-md" />
              </TableCell>
              <TableCell className="font-regular text-foreground truncate max-w-[250px]">{post.titulo}</TableCell>
              <TableCell className="text-foreground font-regular truncate max-w-[300px]">{post.conteudo}</TableCell>
              <TableCell className="text-foreground font-regular text-center">{post.data_publicacao}</TableCell>
              <TableCell className="text-right px-6">
                <div className="flex justify-end gap-3">
                  <button className="text-orange-400 hover:text-orange-500 cursor-pointer"><SquarePen size={18} /></button>
                  <button className="text-red-400 hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Footer (mesma estrutura anterior) */}
      <div className="py-4 grid grid-cols-3 items-center border-t border-gray-100">
        <div></div>
        <div className="flex items-center justify-center gap-4 text-sm text-secondary">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="hover:text-secondary text-medium disabled:opacity-30 cursor-pointer transition-all"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {getPaginationItems().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                  currentPage === page ? "border border-secondary text-secondary bg-white" : "hover:bg-slate-50  cursor-pointer"
                }`}
              >
                {page}
              </button>
            ))}
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <span className="px-1 text-secondary">...</span>
            )}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="disabled:opacity-30 cursor-pointer transition-all flex items-center text-medium"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="text-sm text-muted-foreground font-light text-right hidden sm:block">
          {posts.length.toLocaleString('pt-BR')} resultados
        </div>
      </div>
    </div>
  )
}