import { getAllOrders } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";

import {  Eye, Search, X } from "lucide-react";
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
import dayjs from "dayjs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import OrderDetails from "./OrderDetails";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function OrderTable() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "order_id",
      header: () => "Order ID",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("order_id")}</div>
      ),
    },
    {
      accessorKey: "order_date",
      header: () => "Order Date",
      cell: ({ row }) => (
        <div className="capitalize w-[100px]">
          {dayjs(row.getValue("order_date")).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "order_code",
      header: () => "Order Code",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("order_code")}</div>
      ),
    },
    {
      accessorKey: "shipmet_first_name",
      header: () => "Customer Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("shipmet_first_name")}</div>
      ),
    },
    {
      accessorKey: "shipment_phone_no",
      header: () => "Customer Phone",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("shipment_phone_no")}</div>
      ),
    },
    {
      accessorKey: "city",
      header: () => "City / State",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("city")}</div>
      ),
    },
    {
      accessorKey: "sub_total",
      header: () => "Total Amount",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("sub_total")}</div>
      ),
    },

    {
      accessorKey: "payment_status",
      header: () => "Payment Status",
      cell: ({ row }) => {
        const status = row.getValue("payment_status") as string;
        const statusStyles: Record<string, string> = {
          paid: "bg-green-700 text-white",
          pending: "bg-yellow-100 text-yellow-700",
          failed: "bg-red-100 text-red-700",
          refunded: "bg-blue-100 text-blue-700",
        };
        return (
          <span
            className={`capitalize px-2 py-1 text-xs font-medium rounded-full ${
              statusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },

    {
      accessorKey: "delivery_status",
      header: () => "Delivery Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("delivery_status")}</div>
      ),
    },
    {
      accessorKey: "order_status",
      header: () => "Order Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("order_status")}</div>
      ),
    },
    {
      accessorKey: "awbawb_code",
      header: () => "AWB Code",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("awbawb_code")}</div>
      ),
    },
    {
      accessorKey: "track_url",
      header: () => "Tracking URL",
      cell: () => (
        <div>
          <Button>Track</Button>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => "Actions",
      cell: ({ row }) => {
        const statusStyles: Record<string, string> = {
          paid: "bg-green-100 text-green-700",
          pending: "bg-yellow-100 text-yellow-700",
          failed: "bg-red-100 text-red-700",
          refunded: "bg-blue-100 text-blue-700",
        };
        const [Isopen, setIsopen] = useState(false);
        const { payment_status, order_status, order_id } = row.original;
        return (
          // <DropdownMenu>
          //     <DropdownMenuTrigger asChild>
          //         <Button size="icon" variant={"ghost"}>
          //             <Settings className="h-5 w-5 stroke-slate-500"/>
          //         </Button>
          //     </DropdownMenuTrigger>
          //     <DropdownMenuContent className="w-[150px]">
          //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
          //         <DropdownMenuSeparator />
          //         <DropdownMenuItem className="cursor-pointer">View Order</DropdownMenuItem>
          //         <DropdownMenuItem className="cursor-pointer">Cancel</DropdownMenuItem>
          //         <DropdownMenuItem className="cursor-pointer">Track</DropdownMenuItem>
          //         <DropdownMenuItem className="cursor-pointer">Generate Label</DropdownMenuItem>
          //         <DropdownMenuItem className="cursor-pointer">Resend SMS</DropdownMenuItem>
          //     </DropdownMenuContent>
          //     </DropdownMenu>
          <Dialog open={Isopen} onOpenChange={setIsopen}>
            <DialogTrigger>
              <Button
                //   onClick={() => navigate("/shipment-details")}
                size={"icon"}
                className="rounded-full text-[#171925] bg-[#1719251A]/10  hover:bg-[#1719251A]/20 "
              >
                <Eye className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="[&>button]:hidden  overflow-y-auto h-[40rem] !p-0 !max-w-6xl">
              <DialogHeader className="border-b-2 p-3 px-6 rounded-lg items-center w-full flex flex-row  justify-between">
                <div className="space-y-3">
                  <DialogTitle className="">Order {order_id}</DialogTitle>
                  <div className="space-x-3">
                    {" "}
                    <Badge
                      className={`capitalize px-4  text-xs font-medium rounded-full ${
                        statusStyles[payment_status.toLowerCase()] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {payment_status}
                    </Badge>
                    <Badge
                      className={`capitalize px-4  text-xs font-medium rounded-full ${
                        statusStyles[payment_status.toLowerCase()] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order_status}
                    </Badge>
                    <span className="text-lead text-sm">
                      Mar 30, 2025 22:02
                    </span>
                  </div>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setIsopen(false);
                  }}
                >
                  <X className="w-6 h-6" />
                </div>
              </DialogHeader>
              <OrderDetails />
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];
  const {
    data: orders,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["getAllorders"],
    queryFn: getAllOrders,
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.data,
  });
  

  //   const headers = [
  //     { label: "Order ID", key: "order_id" },
  //     { label: "Order Date", key: "order_date" },
  //     { label: "Order Code", key: "order_code" },
  //     { label: "Customer Name", key: "shipmet_first_name" },
  //     { label: "Customer Phone", key: "shipment_phone_no" },
  //     { label: "City / State", key: "city" },
  //     { label: "Total Amount", key: "sub_total" },
  //     { label: "Payment Status", key: "payment_status" },
  //     { label: "Delivery Status", key: "delivery_status" },
  //     { label: "Order Status", key: "order_status" },
  //     { label: "AWB Code", key: "awbawb_code" },
  //     { label: "Tracking URL", key: "track_url" },
  //     { label: "Actions", key: "actions" },
  //   ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [globalFilter, setGlobalFilter] = useState("");

  const globalFilterFunction = (
    row: any,
    _columnId: string,
    filterValue: any
  ) => {
    const customerName = row.original.shipmet_first_name?.toLowerCase() || "";
    const phoneNumber = row.original.shipment_phone_no || "";
    const orderCode = row.original.order_code?.toLowerCase() || "";

    return (
      customerName.includes(filterValue.toLowerCase()) ||
      phoneNumber.includes(filterValue.toLowerCase()) ||
      orderCode.includes(filterValue.toLowerCase())
    );
  };

  const table = useReactTable({
    data: orders,
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

  if (isLoading) {
    content = <div className="mt-[10%] text-center">Loading...</div>;
  }

  //   if(isError){
  //     content = <p>{error?.response?.data?.message || error?.message}</p>
  //   }

  if (isSuccess && Array.isArray(orders)) {
    content = (
      <div className="bg-white rounded-lg p-4  space-y-2">
        <div className="flex flex-col gap-2 py-1">
          <div className="flex flex-row justify-between gap-3 w-full">
            <div className="flex items-center gap-x-3 ">
              <div>
                <h2 className="font-semibold ">Order list</h2>
                <p className="text-lead text-sm">21 orders found</p>
              </div>

              <div className="w-[180px]">
                <Select
                  onValueChange={(value) =>
                    table
                      .getColumn("role")
                      ?.setFilterValue(value === "all" ? undefined : value)
                  }
                  value={
                    (table.getColumn("role")?.getFilterValue() as string) ??
                    "all"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Array.from(
                      table
                        .getColumn("role")
                        ?.getFacetedUniqueValues()
                        ?.keys() ?? []
                    ).map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {String(value).charAt(0).toUpperCase() +
                          String(value).slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select
                  onValueChange={(value) =>
                    table
                      .getColumn("status")
                      ?.setFilterValue(value === "all" ? undefined : value)
                  }
                  value={
                    (table.getColumn("status")?.getFilterValue() as string) ??
                    "all"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Array.from(
                      table
                        .getColumn("status")
                        ?.getFacetedUniqueValues()
                        ?.keys() ?? []
                    ).map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {String(value).charAt(0).toUpperCase() +
                          String(value).slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by CustomerName, OrderCode    .... "
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
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
                        className="font-semibold text-black text-center"
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
            Total no.of products: {table.getFilteredRowModel().rows.length}
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

  if (isSuccess && typeof orders === "string") {
    content = (
      <p className="font-bold mt-20 text-center capitalize">{orders}</p>
    );
  }

  return content;
}

export default OrderTable;
