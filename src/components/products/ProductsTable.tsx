import { deleteProduct, getAllProducts } from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Download, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues, ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { ProductsType } from "@/types";
import { Filter } from "../ui/Filter";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import ProductToggle from "../ui/ProductToggle";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAppContext } from "@/contexts/AuthContext";


function ProductsTable() {
    const {auth} =useAppContext() 
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationKey: [ "deleteProduct" ],
        mutationFn: deleteProduct,
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: [ "getAllProducts" ] });
            toast.error("Request Success", {
                description: "Product Deletion Success",
            });
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", {
                description: error?.response?.data?.message,
            });
        }
    })

    const columns: ColumnDef<ProductsType>[] = [
        {
            accessorKey: "product_id",
            header:()=> "Product ID",
            cell: ({ row  }) => (
                <div className="capitalize text-primary-blue font-semibold">{row.getValue("product_id")}</div>
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
            accessorKey: "sku",
            header:()=> "SKU Code",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("sku") ? row.getValue("sku") : "-"}</div>
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
                // <div>
                //     <Switch checked={row.getValue("publish")}/>
                // </div>

                <ProductToggle 
                    value="publish"
                    state={row.getValue("publish")}
                    productId={row.getValue("product_id")}
                    
                />
            )
        },
        {
            accessorKey: "isin_todays_deal",
            header:()=> "Today's deal",
            cell: ({ row }) => (
                <ProductToggle 
                    state={row.getValue("isin_todays_deal")}
                    value="isin_todays_deal"
                    productId={row.getValue("product_id")}
                />
                // <div>
                //     <Switch checked={row.getValue("isin_todays_deal")}/>
                // </div>
            )
        },
        // {
        //     accessorKey: "is_featured",
        //     header:()=> "Featured",
        //     cell: ({ row }) => (
        //         <ProductToggle 
        //             state={row.getValue("is_featured")}
        //             value="is_featured"
        //             productId={row.getValue("product_id")}
        //         />
        //     )
        // },
        {
            accessorKey: "best_selling",
            header:()=> "Best Selling",
            cell: ({ row }) => (
                <ProductToggle 
                    state={row.getValue("best_selling")}
                    value="best_selling"
                    productId={row.getValue("product_id")}
                />
            )
        },
        {
            accessorKey: "offer_ending_soon",
            header:()=> "Offer Ending Soon",
            cell: ({ row }) => (
                <ProductToggle 
                    state={row.getValue("offer_ending_soon")}
                    value="offer_ending_soon"
                    productId={row.getValue("product_id")}
                />
            )
        },
        {
            accessorKey: "options",
            header:()=> "Options",
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => (

                <div className="flex flex-row items-center gap-2">

                    {/* <Button
                        size="icon"
                        className="rounded-full text-slate-800 bg-slate-800/10 hover:bg-slate-800/20"
                    >
                        <Eye className="h-5 w-5" />
                    </Button> */}

                    <Button
                        onClick={() => {
                            sessionStorage.setItem("product-id", row.getValue("product_id"));
                            navigate("/products/edit/product-info");
                        }}
                        size="icon"
                        className="rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C7591A]/20"
                    >
                        <Edit className="h-5 w-5" />
                    </Button>

                    {/* <Button
                        size="icon"
                        className="rounded-full text-[#007AFF] bg-[#007AFF1A]/10 hover:bg-[#007AFF1A]/20"
                    >
                        <Copy className="h-5 w-5" />
                    </Button> */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                className="rounded-full text-red-400 bg-red-400/10 hover:bg-red-400/20"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This will permanently delete and remove your product from the servers.
                            </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button onClick={() => mutate({token:auth?.token ?? "" , productId:row.getValue("product_id")})} variant="destructive">Delete</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )
        },
    ]

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: [ "getAllProducts" ],
        queryFn: ()=>getAllProducts(auth?.token ?? ""),
        refetchOnWindowFocus: false
    });


    const headers = [
        { label: "Product ID", key: "product_id" },
        { label: "Product Title", key: "product_name" },
        { label: "Category Title", key: "category_title" },
        { label: "Detail", key: "unit_price" },
        { label: "Current Stock", key: "stock" },
        { label: "Published", key: "publish" },
        { label: "Today's deal", key: "isin_todays_deal" },
        { label: "Best Selling", key: "best_selling" },
        { label: "Offer Ending Soon", key: "offer_ending_soon" },
        { label: "SKU Code", key: "sku" },
        // { label: "Featured", key: "is_featured" },
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