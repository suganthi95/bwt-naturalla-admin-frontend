import { getAllOrders } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Download, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues, ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";
import { Filter } from "../ui/Filter";


const columns: ColumnDef<any>[] = [
    {
      accessorKey: "order_id",
      header:()=> "Order ID",
      cell: ({ row  }) => (
        <div className="capitalize">{row.getValue("order_id")}</div>
      )
    },
    {
      accessorKey: "order_date",
      header:()=> "Order Date",
      cell: ({ row }) => (
        <div className="capitalize w-[100px]">{dayjs(row.getValue("order_date")).format("DD-MM-YYYY")}</div>
      )
    },
    {
      accessorKey: "order_code",
      header:()=> "Order Code",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("order_code")}</div>
      )
    },
    {
      accessorKey: "shipmet_first_name",
      header:()=> "Customer Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("shipmet_first_name")}</div>
      )
    },
    {
      accessorKey: "shipment_phone_no",
      header:()=> "Customer Phone",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("shipment_phone_no")}</div>
      )
    },
    {
      accessorKey: "city",
      header:()=> "City / State",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("city")}</div>
      )
    },
    {
      accessorKey: "sub_total",
      header:()=> "Total Amount",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("sub_total")}</div>
      )
    },
    {
      accessorKey: "payment_status",
      header:()=> "Payment Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("payment_status")}</div>
      )
    },
    {
      accessorKey: "delivery_status",
      header:()=> "Delivery Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("delivery_status")}</div>
      )
    },
    {
      accessorKey: "order_status",
      header:()=> "Order Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("order_status")}</div>
      )
    },
    {
      accessorKey: "awbawb_code",
      header:()=> "AWB Code",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("awbawb_code")}</div>
      )
    },
    {
      accessorKey: "track_url",
      header:()=> "Tracking URL",
      cell: () => (
        <div>
            <Button>Track</Button>
        </div>
      )
    },
    {
      accessorKey: "actions",
      header:()=> "Actions",
      cell: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant={"ghost"}>
                    <Settings className="h-5 w-5 stroke-slate-500"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">View Order</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Cancel</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Track</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Generate Label</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Resend SMS</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
      )
    },
]


function OrderTable() {

    
    const { data: orders, isLoading, isSuccess } = useQuery({
        queryKey: [ "getAllorders" ],
        queryFn: getAllOrders,
        refetchOnWindowFocus: false,
        select:(data)=>data?.data?.data
    });


    const headers = [
        { label: "Order ID", key: "order_id" },
        { label: "Order Date", key: "order_date" },
        { label: "Order Code", key: "order_code" },
        { label: "Customer Name", key: "shipmet_first_name" },
        { label: "Customer Phone", key: "shipment_phone_no" },
        { label: "City / State", key: "city" },
        { label: "Total Amount", key: "sub_total" },
        { label: "Payment Status", key: "payment_status" },
        { label: "Delivery Status", key: "delivery_status" },
        { label: "Order Status", key: "order_status" },
        { label: "AWB Code", key: "awbawb_code" },
        { label: "Tracking URL", key: "track_url" },
        { label: "Actions", key: "actions" },
    ];

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({

    })
    const [rowSelection, setRowSelection] = useState({})

    const [ globalFilter, setGlobalFilter ] = useState("");

    const globalFilterFunction = (row: any, _columnId: string, filterValue: any) => {

        const customerName = row.original.shipmet_first_name?.toLowerCase() || "";
        const phoneNumber = row.original.shipment_phone_no || "";
    
        return (
            customerName.includes(filterValue.toLowerCase()) || phoneNumber.includes(filterValue.toLowerCase())
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
            globalFilter
        },
    });


    let content;

    if(isLoading){
        content = (
        <div className="mt-[10%] text-center">
            Loading...
        </div>
        )
    }

    //   if(isError){
    //     content = <p>{error?.response?.data?.message || error?.message}</p>
    //   }

    if(isSuccess && Array.isArray(orders)){
        content = (
            <div className="bg-white rounded-lg p-4  space-y-2">
                <div className="flex flex-col gap-2 py-1">
                    
                    
                    <div className="flex flex-row justify-between gap-3 w-full">

                        <div className="flex flex-row gap-1 justify-between flex-wrap lg:flex-nowrap">
                            <Input
                                placeholder="Search by Customer Name or Number..."
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="w-full lg:max-w-sm"
                            />

                            <div>
                                {table.getColumn("payment_status") && (
                                    <Filter
                                        column={table.getColumn("payment_status")}
                                        title="Filter by Category"
                                    />
                                )}
                            </div>
                        </div>
                    
                        <div className="flex flex-row items-center gap-1">
                            <CSVLink data={orders} headers={headers} filename={"orders.csv"}>
                                <Button variant="default" className="gap-3 bg-slate-900 hover:bg-slate-900/80">
                                    <Download className="h-5 w-5" />
                                    Export
                                </Button>
                            </CSVLink>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white overflow-scroll max-h-72" align="end">
                                    {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                            }
                                        >
                                            {headers.filter(item => item.key === column.id)[0]?.label}
                                        </DropdownMenuCheckboxItem>
                                        )
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                                <TableHead className="font-semibold text-black text-center" key={header.id} colSpan={header.colSpan} >
                                    {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                        )}
                                </TableHead>
                                )
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
        )
    }

    if(isSuccess && typeof orders === "string"){
        content = <p className="font-bold mt-20 text-center capitalize">{orders}</p>
    }

    return content;
}

export default OrderTable