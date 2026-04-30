interface Props {
  categories: string[];
  active: string;
  onChange: (value: string) => void;
}

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: Props) {
  return (
    /* 1. Container de largura total para centralizar */
    <div className="w-full flex justify-center my-8 px-4">
      <div className="max-w-full overflow-x-auto pb-3 scrollbar-hide">
        <div className="flex flex-nowrap bg-[#E3F2FD] rounded-xl shadow-sm w-max min-w-full">
          {categories.map((cat, index) => {
            const isActive = active === cat;
            const isFirst = index === 0;
            const isLast = index === categories.length - 1;

            return (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className={`
                  relative h-12 px-8 md:px-12 transition-all duration-200 
                  text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap
                  
                  /* Cores */
                  ${isActive 
                    ? "bg-[#2185D0] text-white" 
                    : "text-gray-600 hover:bg-[#D1E9FF]"}
                  
                  /* Bordas das pontas */
                  ${isFirst ? "rounded-l-xl" : ""}
                  ${isLast ? "rounded-r-xl" : ""}

                  /* Divisores */
                  ${!isLast ? "border-r border-white/40" : ""}
                `}
              >
                {cat}

                {isActive && (
                  <div 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2185D0] rotate-45" 
                    style={{ zIndex: 10, borderRadius: '1px' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}