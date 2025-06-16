import { getAllOrders } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues, ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";


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
        <div className="capitalize">{row.getValue("order_date")}</div>
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
    // {
    //   accessorKey: "shipmentStatus",
    //   header:()=> "Shipment Status",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("shipmentStatus")}</div>
    //   )
    // },
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

    // const orders = [
    //     {
    //         orderId: 91,
    //         orderDate: "2025-06-14 10:40",
    //         orderCode: "NTRULA1749877849164",
    //         customerName: "Krishna V",
    //         customerPhone: "7904148922",
    //         cityState: "Salem, Tamil Nadu",
    //         totalAmount: 1099,
    //         paymentStatus: "Paid",
    //         deliveryStatus: "In-Progress",
    //         orderStatus: "In-Progress",
    //         shipmentStatus: "In-Transit",
    //         awbCode: "123456789",
    //         trackingUrl: "https://tracking.example.com/123456789"
    //     },
    //     {
    //         orderId: 92,
    //         orderDate: "2025-06-13 16:15",
    //         orderCode: "NTRULA1749877849165",
    //         customerName: "Anita Sharma",
    //         customerPhone: "9876543210",
    //         cityState: "Mumbai, Maharashtra",
    //         totalAmount: 1599,
    //         paymentStatus: "Paid",
    //         deliveryStatus: "Delivered",
    //         orderStatus: "Completed",
    //         shipmentStatus: "Delivered",
    //         awbCode: "987654321",
    //         trackingUrl: "https://tracking.example.com/987654321"
    //     },
    //     {
    //         orderId: 93,
    //         orderDate: "2025-06-12 09:00",
    //         orderCode: "NTRULA1749877849166",
    //         customerName: "Ravi Kumar",
    //         customerPhone: "9123456789",
    //         cityState: "Bengaluru, Karnataka",
    //         totalAmount: 899,
    //         paymentStatus: "Pending",
    //         deliveryStatus: "Not Shipped",
    //         orderStatus: "Pending",
    //         shipmentStatus: "Pending",
    //         awbCode: "",
    //         trackingUrl: ""
    //     },
    //     {
    //         orderId: 94,
    //         orderDate: "2025-06-14 11:05",
    //         orderCode: "NTRULA1749877849167",
    //         customerName: "Meena George",
    //         customerPhone: "9012345678",
    //         cityState: "Kochi, Kerala",
    //         totalAmount: 1249,
    //         paymentStatus: "Paid",
    //         deliveryStatus: "Out for Delivery",
    //         orderStatus: "In-Progress",
    //         shipmentStatus: "Out for Delivery",
    //         awbCode: "1122334455",
    //         trackingUrl: "https://tracking.example.com/1122334455"
    //     },
    //     {
    //         orderId: 95,
    //         orderDate: "2025-06-11 14:30",
    //         orderCode: "NTRULA1749877849168",
    //         customerName: "Sanjay D",
    //         customerPhone: "8765432109",
    //         cityState: "Delhi, Delhi",
    //         totalAmount: 1349,
    //         paymentStatus: "Paid",
    //         deliveryStatus: "Cancelled",
    //         orderStatus: "Cancelled",
    //         shipmentStatus: "Not Applicable",
    //         awbCode: "",
    //         trackingUrl: ""
    //     }
    // ];

function OrderTable() {

    // const { data, isLoading, isSuccess } = useQuery({
    //     queryKey: [ "getAllProducts" ],
    //     queryFn: getAllProducts,
    //     refetchOnWindowFocus: false
    // });

    // console.log(data)
    
    const { data:orders, isLoading, isSuccess } = useQuery({
        queryKey: [ "getAllorders" ],
        queryFn: getAllOrders,
        refetchOnWindowFocus: false,
        select:(data)=>data?.data?.data
    });



    const headers = [
        { label: "Order ID", key: "orderId" },
        { label: "Order Date", key: "orderDate" },
        { label: "Order Code", key: "orderCode" },
        { label: "Customer Name", key: "customerName" },
        { label: "Customer Phone", key: "customerPhone" },
        { label: "City / State", key: "cityState" },
        { label: "Total Amount", key: "totalAmount" },
        { label: "Payment Status", key: "paymentStatus" },
        { label: "Delivery Status", key: "deliveryStatus" },
        { label: "Order Status", key: "orderStatus" },
        { label: "Shipment Status", key: "shipmentStatus" },
        { label: "AWB Code", key: "awbCode" },
        { label: "Tracking URL", key: "trackingUrl" },
        { label: "Actions", key: "actions" },
    ];

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({

    })
    const [rowSelection, setRowSelection] = useState({})

    const [ globalFilter, setGlobalFilter ] = useState("");

    // const globalFilterFunction = (row:any, _columnId:any, filterValue:any) => {
    //     const firstName = row.original.runner_first_name?.toLowerCase() || "";
    //     const lastName = row.original.runner_last_name?.toLowerCase() || "";
    //     const phoneNumber = row.original.runner_phone_number || "";
    //     const email = row.original.runner_email_id || "";
    
    //     return (
    //     firstName.includes(filterValue.toLowerCase()) || lastName.includes(filterValue.toLowerCase()) ||
    //     phoneNumber.includes(filterValue) || email.includes(filterValue)
    //     );
    // };

    
    
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
        // globalFilterFn: globalFilterFunction,
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
        <div className="mt-[10%]">
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
                    
                    
                    <div className="flex flex-row gap-3 w-full">

                        <div className="flex flex-col lg:flex-row gap-3 justify-between w-full">
                            <Input
                                placeholder="Filter by Name or Mobile Number or Email..."
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="w-full lg:max-w-sm"
                            />

                            <div className="flex flex-row gap-1 justify-between flex-wrap lg:flex-nowrap">
                                {/* {table.getColumn("type_name") && (
                                <Filter
                                    column={table.getColumn("type_name")}
                                    title="Filter by Race type"
                                    options={[
                                    {
                                        value: "Run Tickets",
                                        label: "Run Tickets",
                                        // icon: QuestionMarkCircledIcon,
                                    },
                                    {
                                        value: "Run Tickets + Donate",
                                        label: "Run Tickets + Donate",
                                        // icon: QuestionMarkCircledIcon,
                                    },
                                    ]}
                                />
                                )}

                                {table.getColumn("role") && (
                                <Filter
                                    column={table.getColumn("role")}
                                    title="Filter by Runners"
                                    options={[
                                    {
                                        value: "runner",
                                        label: "Runners",
                                        // icon: QuestionMarkCircledIcon,
                                    },
                                    {
                                        value: "corporate runner",
                                        label: "Corporate Runners",
                                        // icon: QuestionMarkCircledIcon,
                                    },
                                    ]}
                                />
                                )}

                                {table.getColumn("race_type_name") && (
                                <Filter
                                    column={table.getColumn("race_type_name")}
                                    title="Filter by Run type"
                                    options={[
                                    {
                                        value: "10k",
                                        label: "10K",
                                        // icon: QuestionMarkCircledIcon,
                                    },
                                    {
                                        value: "5k",
                                        label: "5K",
                                        // icon: QuestionMarkCircledIcon,
                                    },
                                    {
                                        value: "1k",
                                        label: "1K",
                                        // icon: QuestionMarkCircledIcon,
                                    },
                                    ]}
                                />
                                )} */}
                            </div>
                        </div>
                    
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