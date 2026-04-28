import { Search, ChevronDown, X } from "lucide-react";

export default function MapSearch() {
  return (
    <div className="w-full max-w-lg flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 h-12">
      <button className="flex items-center gap-2 px-4 border-r border-gray-100 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
        Clínicas
        <ChevronDown className="w-4 h-4" />
      </button>
      
      <div className="flex-1 flex items-center px-3 bg-white">
        <div className="flex items-center gap-2 bg-[#E2E8F0] px-3 py-1 rounded-full">
          <span className="text-xs font-medium text-gray-700">Centro</span>
          <X className="w-3 h-3 text-gray-500 cursor-pointer hover:text-gray-800" />
        </div>
        <input 
          type="text"
          className="flex-1 outline-none px-3 text-sm text-gray-700 placeholder:text-gray-400"
        />
      </div>

      <button className="bg-[#002749] w-14 flex items-center justify-center hover:bg-[#001d36] transition-colors shrink-0">
        <Search className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}