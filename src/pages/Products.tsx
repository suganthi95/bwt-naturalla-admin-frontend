import ProductsTable from "@/components/products/ProductsTable";
import { Button } from "@/components/ui/button"
import { Ellipsis } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Products() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>

        <div className="flex flex-row items-center gap-5">
          <Button onClick={() => navigate("add/product-info")}>Add Product</Button>
          <Button size="icon" variant="outline">
            <Ellipsis />
          </Button>
        </div>
      </div>
      <div>
        <ProductsTable/>
      </div>
    </div>
  )
}

export default Products