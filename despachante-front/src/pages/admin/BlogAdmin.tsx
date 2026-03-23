import BuscaBlog from "@/components/sections/admin/blog/BuscaCadastroBlog"
import BlogTable from "@/components/tables/BlogTable";

export function BlogAdmin() {
  return (
    <div>
      <BuscaBlog></BuscaBlog>
      <BlogTable></BlogTable>
      </div>
  );
}