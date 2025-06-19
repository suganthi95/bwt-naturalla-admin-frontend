import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  revenue: number;
  status: "Active" | "Inactive";
};
const data: Product[] = [
  {
    id: "P001",
    name: "Red Wine Face Wash",
    image: "https://via.placeholder.com/80x100",
    price: 29.99,
    quantity: 120,
    revenue: 3598.8,
    status: "Active",
  },
  {
    id: "P002",
    name: "Red Wine Face Wash",
    image: "https://via.placeholder.com/80x100",
    price: 49.99,
    quantity: 80,
    revenue: 3999.2,
    status: "Inactive",
  },
   {
    id: "P003",
    name: "Red Wine Face Wash",
    image: "https://via.placeholder.com/80x100",
    price: 49.99,
    quantity: 80,
    revenue: 3999.2,
    status: "Inactive",
  }, {
    id: "P004",
    name: "Red Wine Face Wash",
    image: "https://via.placeholder.com/80x100",
    price: 49.99,
    quantity: 80,
    revenue: 3999.2,
    status: "Inactive",
  }, {
    id: "P005",
    name: "Red Wine Face Wash",
    image: "https://via.placeholder.com/80x100",
    price: 49.99,
    quantity: 80,
    revenue: 3999.2,
    status: "Inactive",
  }, {
    id: "P006",
    name: "Red Wine Face Wash",
    image: "https://via.placeholder.com/80x100",
    price: 49.99,
    quantity: 80,
    revenue: 3999.2,
    status: "Inactive",
  }, {
    id: "P007",
    name: "Red Wine Face Wash",
    image: "https://via.placeholder.com/80x100",
    price: 49.99,
    quantity: 80,
    revenue: 3999.2,
    status: "Inactive",
  },
];
const columns: ColumnDef<Product>[] = [
  {
    header: "Product",
    accessorKey: "name",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex gap-3 items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-16 object-cover rounded-md"
          />
          <div>
            <div className="font-medium text-gray-800">{product.name}</div>
          </div>
        </div>
      );
    },
  },
  { accessorKey: "id", header: "Product ID" },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => `₹${(getValue() as number).toFixed(2)}`,
  },
  { accessorKey: "quantity", header: "Quantity" },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ getValue }) => `₹${(getValue() as number).toFixed(2)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusColor =
        status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      );
    },
  },
];

export default function ProductOverview() {
      const [page, setPage] = useState(0);
  const table = useReactTable({
    data,
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
            <Ellipsis/>
        </div>
          <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="text-left bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
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

        {Array.from({ length: table.getPageCount() }).map((_, i) => (
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
