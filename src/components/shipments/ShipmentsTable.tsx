import { getShipmentList } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Download, Eye, MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues, ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import { Filter } from "../ui/Filter";
import { Checkbox } from "../ui/checkbox";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAppContext } from "@/contexts/AuthContext";


function ShipmentsTable() {

    const {auth} = useAppContext()
    const navigate  = useNavigate()

    const columns: ColumnDef<any>[] = [
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
            accessorKey: "shipment_id",
            enableHiding: false,
            enableSorting: false
        },
        {
            accessorKey: "awb_code",
            header:()=> "AWB Code",
            cell: ({ row  }) => (
                <div className="capitalize text-primary-blue font-semibold">{row.getValue("awb_code")}</div>
            )
        },
        {
            accessorKey: "origin",
            header:()=> "Origin → Destination",
            enableHiding: false,
        },
        {
            accessorKey: "destination",
            header:()=> "Origin → Destination",
            cell: ({ row }) => (
                <div className="capitalize flex flex-row items-center gap-5">{row.getValue("origin")} <MoveRight /> {row.getValue("destination")}</div>
            )
        },
        {
            accessorKey: "pickup_date",
            header:()=> "Pickup Date",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("pickup_date") ? dayjs(row.getValue("pickup_date")).format("DD-MM-YYYY, hh:mm A") : "-"}</div>
            )
        },
        {
            accessorKey: "edd",
            header:()=> "EDD",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("edd") ? dayjs(row.getValue("edd")).format("DD-MM-YYYY, hh:mm A") : "-"}</div>
            )
        },
        {
            accessorKey: "current_status",
            header:()=> "Status",
            cell: ({ row }) => {
                if(row.getValue("current_status") === "Canceled"){
                    return(
                        <span className="bg-orange-400/25 text-orange-400 rounded-full capitalize px-3 py-1">{row.getValue("current_status")}</span>
                    )
                }

                if(row.getValue("current_status") === "Pickup Generated"){
                    return(
                        <span className="bg-blue-400/25 text-blue-400 rounded-full capitalize px-3 py-1">{row.getValue("current_status")}</span>
                    )
                }

                return(
                    <span className="bg-blue-400/25 text-blue-400 rounded-full capitalize px-3 py-1">{row.getValue("current_status")}</span>
                )
            }
        },
        {
            accessorKey: "actions",
            header:()=> "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex flex-row items-center gap-5">
                    <Button onClick={()=>navigate(`/shipment-details/${row.getValue("shipment_id")}`)} size={"icon"} className="rounded-full text-[#171925] bg-[#1719251A]/10  hover:bg-[#1719251A]/20 ">
                        <Eye className="h-5 w-5" />
                    </Button>
                    {/* <Button size={"icon"} className="rounded-full text-[#007AFF] bg-[#007AFF1A]/10 hover:bg-[#007AFF1A]/20">
                        <Icons.Print className="h-5 w-5" />
                    </Button>
                    <Button size={"icon"} className="rounded-full text-red-400 bg-red-400/25 hover:bg-red-400/10">
                        <Trash2 className="h-5 w-5" />
                    </Button> */}
                </div>
            )
        },
    ]

    const { data: shipments, isLoading, isSuccess } = useQuery({
        queryKey: [ "getShipmentList" ],
        queryFn:()=>getShipmentList(auth?.token ?? ""),
        refetchOnWindowFocus: false,
        select:(data) => data?.data?.data
    });


    const headers = [
        { label: "AWB Code", key: "awb_code" },
        { label: "Origin / Destination", key: "destination" },
        { label: "Pickup Date", key: "pickup_date" },
        { label: "EDD", key: "edd" },
        { label: "Status", key: "current_status" },
    ];

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        origin: false,
        shipment_id: false
    })
    const [rowSelection, setRowSelection] = useState({})

    const [ globalFilter, setGlobalFilter ] = useState("");

    const globalFilterFunction = (row: any, _columnId: string, filterValue: any) => {

        const awbCode = row.original.awb_code?.toLowerCase() || "";
    
        return (
            awbCode.includes(filterValue.toLowerCase())
        );
    };

    
    
    const table = useReactTable({
        data: shipments,
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

    if(isSuccess && Array.isArray(shipments)){
        content = (
            <div className="bg-white rounded-lg p-4  space-y-2">
                <div className="flex flex-col gap-2 py-1">
                    
                    
                    <div className="flex flex-row justify-between gap-3 w-full">

                        <div className="flex flex-row gap-1 justify-between flex-wrap lg:flex-nowrap">
                            <Input
                                placeholder="Search by AWB Code..."
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="w-full lg:max-w-sm"
                            />

                            <div>
                                {table.getColumn("current_status") && (
                                    <Filter
                                        column={table.getColumn("current_status")}
                                        title="Filter by Category"
                                    />
                                )}
                            </div>
                        </div>
                    
                        <div className="flex flex-row items-center gap-1">
                            <CSVLink data={shipments} headers={headers} filename={"shipment.csv"}>
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
                                <TableHead className="font-semibold text-black" key={header.id} colSpan={header.colSpan} >
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
                    Total no.of shipments: {table.getFilteredRowModel().rows.length}
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

    if(isSuccess && typeof shipments === "string"){
        content = <p className="font-bold mt-20 text-center capitalize">{shipments}</p>
    }

    return content;
}

export default ShipmentsTable