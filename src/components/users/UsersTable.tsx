import { getAllOrders } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Download, SquarePen, UserRoundX } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues, ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import { Filter } from "../ui/Filter";
import { Checkbox } from "../ui/checkbox";


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
      accessorKey: "username",
      header:()=> "Username",
      cell: ({ row  }) => (
        <div className="capitalize text-primary-blue font-semibold">{row.getValue("username")}</div>
      )
    },
    {
      accessorKey: "email",
      header:()=> "Email Address",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("email")}</div>
      )
    },
    {
      accessorKey: "role",
      header:()=> "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      )
    },
    {
      accessorKey: "status",
      header:()=> "Status",
      cell: ({ row }) => {
        if(row.getValue("status") === "active"){
            return(
                <span className="bg-green-400/25 text-green-400 rounded-full capitalize px-3 py-1">{row.getValue("status")}</span>
            )
        }

        if(row.getValue("status") === "inactive"){
            return(
                <span className="bg-red-400/25 text-red-400 rounded-full capitalize px-3 py-1">{row.getValue("status")}</span>
            )
        }
      }
    },
    {
      accessorKey: "lastLogin",
      header:()=> "Last Login",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("lastLogin")}</div>
      )
    },
    
    {
      accessorKey: "actions",
      header:()=> "Actions",
      enableHiding: false,
      cell: () => (
        <div className="flex flex-row items-center gap-5">
            <Button size={"icon"} className="rounded-full text-green-400 bg-green-400/25 hover:bg-green-400/10">
                <SquarePen className="h-5 w-5" />
            </Button>
            <Button size={"icon"} className="rounded-full text-red-400 bg-red-400/25 hover:bg-red-400/10">
                <UserRoundX className="h-5 w-5" />
            </Button>
        </div>
      )
    },
]

const data = [
    {
        username: "Ramanan",
        email: "ramanan1633@gmail.com",
        role: "admin",
        lastLogin: "18-07-2025, 13:50",
        status: "active"
    },
    {
        username: "Priya",
        email: "priya.k@example.com",
        role: "editor",
        lastLogin: "15-07-2025, 09:30",
        status: "inactive"
    },
    {
        username: "Arjun",
        email: "arjun.m@example.com",
        role: "viewer",
        lastLogin: "16-07-2025, 21:10",
        status: "active"
    },
    {
        username: "Meera",
        email: "meera.singh@example.com",
        role: "admin",
        lastLogin: "17-07-2025, 11:25",
        status: "active"
    },
    {
        username: "Vikram",
        email: "vikram.r@example.com",
        role: "editor",
        lastLogin: "12-07-2025, 14:50",
        status: "inactive"
    },
    {
        username: "Aisha",
        email: "aisha.z@example.com",
        role: "viewer",
        lastLogin: "14-07-2025, 18:15",
        status: "active"
    }
];



function UsersTable() {

    
    const { data: orders, isLoading, isSuccess } = useQuery({
        queryKey: [ "getAllorders" ],
        queryFn: getAllOrders,
        refetchOnWindowFocus: false,
        select:(data)=>data?.data?.data
    });


    const headers = [
        { label: "Username", key: "username" },
        { label: "Email Address", key: "email" },
        { label: "Role", key: "role" },
        { label: "Status", key: "status" },
        { label: "Last Login", key: "lastLogin" },
    ];

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        origin: false
    })
    const [rowSelection, setRowSelection] = useState({})

    const [ globalFilter, setGlobalFilter ] = useState("");

    const globalFilterFunction = (row: any, _columnId: string, filterValue: any) => {

        const username = row.original.username?.toLowerCase() || "";
    
        return (
            username.includes(filterValue.toLowerCase())
        );
    };

    
    
    const table = useReactTable({
        data: data,
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
                                placeholder="Search by Username..."
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="w-full lg:max-w-sm"
                            />

                            <div>
                                {table.getColumn("status") && (
                                    <Filter
                                        column={table.getColumn("status")}
                                        title="Filter by Category"
                                    />
                                )}
                            </div>
                        </div>
                    
                        <div className="flex flex-row items-center gap-1">
                            <CSVLink data={data} headers={headers} filename={"shipment.csv"}>
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

export default UsersTable