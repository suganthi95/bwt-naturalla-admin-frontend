import { getAllProducts } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Download, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues, ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { ProductsType } from "@/types";
import { Switch } from "../ui/switch";
import { Filter } from "../ui/Filter";
import { CSVLink } from "react-csv";


const columns: ColumnDef<ProductsType>[] = [
    {
      accessorKey: "id",
      header:()=> "#",
      cell: ({ row  }) => (
        <div className="capitalize">{parseInt(row.id) + 1}</div>
      )
    },
    {
      accessorKey: "product_name",
      header:()=> "Product Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("product_name")}</div>
      )
    },
    {
      accessorKey: "category_title",
      header:()=> "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category_title")}</div>
      )
    },
    {
      accessorKey: "unit_price",
      header:()=> "Detail",
      cell: ({ row }) => (
        <div className="capitalize">₹ {row.getValue("unit_price")} / Nos</div>
      )
    },
    {
      accessorKey: "stock",
      header:()=> "Current Stock",
      cell: () => (
        <div className="capitalize">{"44"}</div>
      )
    },
    {
      accessorKey: "publish",
      header:()=> "Published",
      cell: ({ row }) => (
        <div>
            <Switch checked={row.getValue("publish")}/>
        </div>
      )
    },
    {
      accessorKey: "isin_todays_deal",
      header:()=> "Today's deal",
      cell: ({ row }) => (
        <div>
            <Switch checked={row.getValue("isin_todays_deal")}/>
        </div>
      )
    },
    {
      accessorKey: "is_featured",
      header:()=> "Featured",
      cell: ({ row }) => (
        <div>
            <Switch checked={row.getValue("is_featured")}/>
        </div>
      )
    },
    {
      accessorKey: "options",
      header:()=> "Options",
      cell: () => (
        <Button size="icon" variant={"ghost"}>
            <Settings className="h-5 w-5 stroke-slate-500"/>
        </Button>
      )
    },
]

function ProductsTable() {

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: [ "getAllProducts" ],
        queryFn: getAllProducts,
        refetchOnWindowFocus: false
    });

    console.log(data)

    const headers = [
        { label: "#", key: "id" },
        { label: "Product Title", key: "product_name" },
        { label: "Detail", key: "unit_price" },
        { label: "Current Stock", key: "stock" },
        { label: "Published", key: "publish" },
        { label: "Today's deal", key: "isin_todays_deal" },
        { label: "Featured", key: "is_featured" },
        { label: "Options", key: "options" },
    ];

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({

    })
    const [rowSelection, setRowSelection] = useState({})

    const [ globalFilter, setGlobalFilter ] = useState("");

    const globalFilterFunction = (row: any, _columnId: string, filterValue: any) => {
        const productName = row.original.product_name?.toLowerCase() || "";
    
        return (
            productName.includes(filterValue.toLowerCase())
        );
    };

    
    
    const table = useReactTable({
        data: data?.data?.products,
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

    if(isSuccess && Array.isArray(data?.data?.products)){
        content = (
            <div className="bg-white rounded-lg p-4  space-y-2">
                <div className="flex flex-col gap-2 py-1">
                    
                    
                    <div className="flex flex-row gap-3 w-full">

                        <div className="flex flex-col lg:flex-row gap-3 justify-between w-full">

                            <div className="flex flex-row gap-1 justify-between flex-wrap lg:flex-nowrap">
                                <Input
                                    placeholder="Search by Product Name..."
                                    value={globalFilter}
                                    onChange={(event) => setGlobalFilter(event.target.value)}
                                    className="w-full lg:w-[300px]"
                                />

                                {table.getColumn("category_title") && (
                                    <Filter
                                        column={table.getColumn("category_title")}
                                        title="Filter by Category"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-1">
                            <CSVLink data={data?.data?.products} headers={headers} filename={"products.csv"}>
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

    if(isSuccess && typeof data?.data === "string"){
        content = <p className="font-bold mt-20 text-center capitalize">{data?.data}</p>
    }

    return content;
}

export default ProductsTable