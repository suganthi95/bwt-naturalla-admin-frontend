import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import  { useState } from 'react'
import { Button } from '../ui/button';


  export type ProductSales = {
  product_name: string;
  unit_price: number;
  publish: boolean;
  sku: string | null;
  product_thumbnail_image: string;
  product_id: number;
  total_quantity: number;
  total_revenue: number;
};

interface Props{
  product:ProductSales[]
}

const columns: ColumnDef<ProductSales>[] = [
  {
    header: "Product",
    accessorKey: "product_name",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex gap-3 items-center">
          <img
            src={product.product_thumbnail_image}
            alt={product.product_name}
            className="w-12 h-16 object-cover rounded-md"
          />
          <div>
            <div className="font-medium text-gray-800">{product.product_name}</div>
          </div>
        </div>
      );
    },
  },
  { accessorKey: "product_id", header: ()=><div className='truncate'>Product ID</div> },
  {
    accessorKey: "unit_price",
    header: "Price",
    cell: ({ getValue }) => `₹${(getValue() as number).toFixed(2)}`,
  },
  { accessorKey: "total_quantity", header: "Quantity" },
  {
    accessorKey: "total_revenue",
    header: "Revenue",
    cell: ({ getValue }) => `₹${(getValue() as number).toFixed(2)}`,
  },
  {
    accessorKey: "publish",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.publish;
      const statusColor =
        status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status ? "Active":"In-active"}
        </span>
      );
    },
  },
];

export default function ProductOverview({product}:Props) {
      const [page, setPage] = useState(0);
  const table = useReactTable({
    data:product ?? [],
    columns,
    state: {
      pagination: {
        pageIndex: page,
        pageSize: 4,
      },
    },
    onPaginationChange: (updater) => {
      const newPage = typeof updater === "function" ? updater({ pageIndex: page, pageSize: 5 }) : updater;
      setPage(newPage.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className='bg-white p-4 rounded-xl '>
         <div className='flex items-center justify-between'>
            <h2 className='font-semibold text-primary-black'>Product Overview</h2>
            {/* <Ellipsis/> */}
        </div>
          <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="text-left bg-gray-50">
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <tr key={headerGroup?.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header?.id} className="px-4 py-2 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table?.getRowModel()?.rows?.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row?.getVisibleCells()?.map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center tems-center gap-2 mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-2 border rounded disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: table.getPageCount() })?.map((_, i) => (
          <Button
            key={i}
            onClick={() => table.setPageIndex(i)}
            className={` w-8 h-8 hover:bg-[#1E401D] text-sm rounded-full ${
              i === table.getState().pagination.pageIndex
                ? "bg-[#1E401D] text-white"
                : " bg-[#1E401D]/80 "
            }`}
          >
            {i + 1}
          </Button>
        ))}

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 border rounded disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
