    "use client";

    import { Button } from "@/components/ui/button";
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Categorias } from '@/mocks/categoria';
import { format } from "date-fns"; // Certifique-se de ter o date-fns instalado
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

    export default function NovoRelatorio() {
    const navigate = useNavigate();
    
    // Estados do Formulário - Mantidos exatamente como você solicitou
    const [categoria, setCategoria] = useState("");
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataInicio, setDataInicio] = useState<Date>();
    const [dataTermino, setDataTermino] = useState<Date>();
    const [salvando, setSalvando] = useState(false);

    const catOptions = Categorias.categorias;

    const handleCriarRelatorio = async () => {
        // 1. Validação de campos obrigatórios
        if (!categoria || !nome || !descricao || !dataInicio || !dataTermino) {
        alert("Por favor, preencha os dados obrigatórios para criação do novo relatório.");
        return;
        }

        // 2. Validação de lógica de datas
        if (dataTermino < dataInicio) {
        alert("A data de término não pode ser menor que a data de início.");
        return;
        }

        setSalvando(true);

        try {
        // 3. Montagem do Payload (Adaptado para puxar dos seus estados)
        const payload = {
            categoria,
            nome,
            descricao,
            dataInicio: format(dataInicio, "yyyy-MM-dd"),
            dataTermino: format(dataTermino, "yyyy-MM-dd"),
        };

        // ✅ Exibindo o payload no console conforme solicitado
        console.log("Payload enviado:", payload);

        // Simulação de envio
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert("Relatório gerado com sucesso!");
        navigate(-1);
        } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Ocorreu um erro ao salvar o relatório.");
        } finally {
        setSalvando(false);
        }
    };

    return (
        <div className="min-h-screen text-muted-foreground animate-in fade-in duration-500">
        
        <header className="mb-8">
            <h1 className="text-2xl font-bold text-secondary">Gerar relatório</h1>
            <p className="text-sm text-gray-500">Gere novos relatórios sempre que precisar</p>
        </header>

        <main className="gap-6 items-start">
            <div className="w-full h-full">
            <section className="bg-white rounded-lg border border-gray-300 overflow-hidden h-full shadow-sm">
                <div className="flex items-center gap-2 p-4 border-b border-gray-300 bg-gray-50">
                <FileText size={22} className="text-secondary" />
                <h2 className="font-semibold text-gray-800">Gerar novo relatório</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Campo Categoria */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                        Categoria <span className="text-red-500">*</span>
                        </label>
                        <Select value={categoria} onValueChange={setCategoria}>
                        <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-primary max-w-[500px] cursor-pointer text-slate-700">
                            <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {catOptions.map((opcao) => (
                            <SelectItem key={opcao.value} value={opcao.value} className='hover:bg-muted cursor-pointer'>
                                {opcao.label}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    {/* Campo Nome */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                        Nome <span className="text-red-500">*</span>
                        </label>
                        <Input 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        className="text-slate-700"
                        />
                    </div>

                    {/* Campo Descrição */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                        Descrição <span className="text-red-500">*</span>
                        </label>
                        <Input 
                        value={descricao} 
                        onChange={(e) => setDescricao(e.target.value)} 
                        className="text-slate-700"
                        />
                    </div>

                    {/* Grid de Datas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                            Data de início <span className="text-red-500">*</span>
                        </label>
                        <DatePicker date={dataInicio} setDate={setDataInicio} placeholder='Pick a date' />
                        </div>

                        <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                            Data de término <span className="text-red-500">*</span>
                        </label>
                        <DatePicker date={dataTermino} setDate={setDataTermino} placeholder='Pick a date' />
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </main>

        <footer className="mt-12 flex justify-end items-center gap-4">
            <Button 
            type="button"
            variant="outline" 
            onClick={() => navigate(-1)} 
            disabled={salvando}
            className="cursor-pointer text-black transition-opacity hover:opacity-70 h-11 px-6 rounded-lg font-medium"
            >
            Cancelar
            </Button>

            <Button 
            type="button"
            onClick={handleCriarRelatorio}
            disabled={salvando}
            className="cursor-pointer bg-primary text-white font-semibold shadow-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 h-11 px-6 rounded-lg"
            >
            {salvando ? "Salvando relatório..." : "Gerar novo relatório"}
            </Button>
        </footer>
        </div>
    );
    }