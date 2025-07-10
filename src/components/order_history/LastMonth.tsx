
import { useState } from "react";
import { Input } from "../ui/input";

import { ArrowDownToLine, Eye, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

import { Checkbox } from "../ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { UserOrderHistoryType } from "@/types/type";
import OrderHistoryDetails from "./OrderHistoryDetails";


interface Props{
  orderHistory:UserOrderHistoryType[]
}
function LastMonth({orderHistory}:Props) {
//   const queryClinet = useQueryClient();



  const columns: ColumnDef<UserOrderHistoryType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "order_id",
      header: () => "Order ID",
      cell: ({ row }) => (
        <div className="capitalize text-primary-blue font-semibold">
          {row.getValue("order_id")}
        </div>
      ),
    },
    {
      accessorKey: "order_date",
      header: () => "Order Date",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("order_date")}</div>
      ),
    },
    {
      accessorKey: "items",
      header: () => "Itmes",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("items") ?? 0}</div>
      ),
    },
        {
      accessorKey: "total_amount",
      header: () => "Total Amount",
      cell: ({ row }) => (
        <div className="capitalize"> ₹ {row.getValue("total_amount")}</div>
      ),
    },
    {
      accessorKey: "order_status",
      header: () => "Status",
      cell: ({ row }) => {
        const status = String(row.getValue("order_status")).toLowerCase();

        const statusColorMap: Record<string, string> = {
            "order created": "bg-purple-500/20 text-purple-600",
          "order confirmed": "bg-blue-500/20 text-blue-600",
          "in progress": "bg-yellow-500/20 text-yellow-600",
          "completed": "bg-green-500/20 text-green-600",
          "delivered": "bg-emerald-500/20 text-emerald-600",
          "cancelled": "bg-red-500/20 text-red-600",
          "rto": "bg-orange-500/20 text-orange-600",
          "in transit": "bg-sky-500/20 text-sky-600",
          "processing": "bg-indigo-500/20 text-indigo-600",
          "failed": "bg-rose-500/20 text-rose-600",
        };

        const statusClass =
          statusColorMap[status] || "bg-gray-300/20 text-gray-700";

        return (
          <span className={`${statusClass} rounded-full capitalize px-3 py-1 text-xs`}>
            {row.getValue("order_status")}
          </span>
        );
      },
    },
    {
      accessorKey: "invoice_url",
    },
    {
      accessorKey: "actions",
      header: () => "Actions",
      enableHiding: false,
      cell: ({ row }) => {
     
        const [Isopen, setIsopen] = useState(false);

        return (
          <div className="flex flex-row items-center gap-5">
            <Dialog open={Isopen} onOpenChange={setIsopen}>
              <DialogTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full text-[#171925] bg-[#171925]/10 hover:bg-[#171925]/20"
                >
                  <Eye className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="[&>button]:hidden  !p-0 overflow-y-auto !max-w-3xl">
                <DialogHeader className="bg-[#F5F5F5] p-3 px-6 rounded-lg items-center w-full flex flex-row  justify-between">
                  <DialogTitle className=""> Order Details - {row.original.order_id}</DialogTitle>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setIsopen(false);
                    }}
                  >
                    <X className="w-6 h-6" />
                  </div>
                </DialogHeader>
                <OrderHistoryDetails 
                  onClose={setIsopen} 
                  order_id={row.original.order_id} 
                  invoice_url={row.original.invoice_url}
                />
              </DialogContent>
            </Dialog>

            <Button
              disabled={!row.getValue("invoice_url")}
              onClick={() => window.open(row.getValue("invoice_url"))}
              size="icon"
              variant="ghost"
              className="rounded-full text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/20"
            >
              <ArrowDownToLine className="w-5 h-5" />
            </Button>
          </div>
        );
      },
    },
  ];
  //   const headers = [
  //     { label: "Username", key: "username" },
  //     { label: "Email Address", key: "email" },
  //     { label: "Role", key: "role" },
  //     { label: "Status", key: "status" },
  //     { label: "Last Login", key: "lastLogin" },
  //   ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    origin: false,
    invoice_url: false
  });

  const [rowSelection, setRowSelection] = useState({});

  const [globalFilter, setGlobalFilter] = useState("");

  const globalFilterFunction = (
    row: any,
    _columnId: string,
    filterValue: any
  ) => {
    const orderId = String(row.original.order_id)
    const search = String(filterValue).toLowerCase().trim();

    return orderId.includes(search);
  };


  const table = useReactTable({
    data: orderHistory,
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: globalFilterFunction,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  let content;



  //   if(isError){
  //     content = <p>{error?.response?.data?.message || error?.message}</p>
  //   }

  if (orderHistory) {
    content = (
      <div className="bg-white rounded-lg   space-y-2">
        <div className="flex items-center gap-x-3 ">
         
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders    .... "
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>
    
        </div>

        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="bg-slate-50" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="font-semibold text-black"
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {/* {table.getFilteredSelectedRowModel().rows.length} of{" "} */}
            {/* {table.getFilteredRowModel().rows.length} row(s) selected. */}
            Total no.of users: {table.getFilteredRowModel().rows.length}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orderHistory && typeof orderHistory === "string") {
    content = <p className="font-bold mt-20 text-center capitalize">{orderHistory}</p>;
  }

  return content;
}

export default LastMonth;
