import { useMemo, useState } from "react";
import { Input } from "../ui/input";

import { Copy, Edit, Loader2, Search, Trash2, X } from "lucide-react";
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
// import { CSVLink } from "react-csv";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import UpdateCategory from "./UpdateCategory";
import { deleteCategory, getAllCategories } from "@/lib/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useAppContext } from "@/contexts/AuthContext";

function CategoryTable() {
  const {auth} = useAppContext()
  const [Isopen, setIsopen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const { mutate: onDelete, isPending } = useMutation({
    mutationKey: ["deleteuser"],
    mutationFn: (args:{token:string,id: string}) => deleteCategory(args.token,args.id),
  });

  const {
    data: categories,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["getAllcategories"],
    queryFn:()=>getAllCategories(auth?.token ?? ""),
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.categories,
  });

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        enableSorting: false,
        size: 50,
      },
      {
        accessorKey: "category_title",
        header: () => <div className="text-center">Category</div>,
        cell: ({ row }) => {
          const { category_title, thumbnail_url } = row.original;
          return (
            <div className="flex  justify-center items-center gap-2">
              <img
                src={thumbnail_url}
                alt={category_title}
                className="w-14 h-14 rounded object-contain"
              />
              <span className="capitalize">
                {row.getValue("category_title")}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "subcategory",
        header: () => <div className="text-left">Sub-category</div>,
        cell: ({ row }) => {
          const subcategories = row.original.subcategories;

          return (
            <div className="flex items-center gap-1 flex-wrap">
              {subcategories?.slice(0, 2).map((item: any, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-primary-blue text-white hover:bg-primary-blue/80 text-xs"
                >
                  {item.subcategory_name}
                </Badge>
              ))}

              {subcategories.length > 2 && (
                <TooltipProvider >
                  <Tooltip >
                    <TooltipTrigger asChild >
                      <Badge className="text-xs px-2 hover:bg-transparent py-0.5 border border-muted bg-muted/10 text-muted-foreground rounded-full cursor-pointer">
                        +{subcategories.length - 2}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">
                      {subcategories
                        .slice(2)
                        .map((sub: any) => sub.subcategory_name)
                        .join(", ")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        },
      },

      {
        accessorKey: "product_count",
        header: () => <div className="text-center">No. of Products</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("product_count")}</div>
        ),
      },
      {
        accessorKey: "tax_percent",
        header: () => <div className="text-center">Tax</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("tax_percent")}</div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => {
          const [open, setOpen] = useState(false);
          return (
            <div className="flex justify-center items-center gap-4">
              <Button
                type="button"
                onClick={() => {
                  setSelectedCategory(row.original);
                  setIsopen(true);
                }}
                className="rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C7591A]/20"
              >
                <Edit className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                className="rounded-full text-[#007AFF] bg-[#007AFF1A]/10 hover:bg-[#007AFF1A]/20"
              >
                <Copy className="h-5 w-5" />
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-full text-red-400 bg-red-400/25 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-red-600">
                      Delete User
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-black">
                      {row.original.category_title}
                    </span>
                    ? This action cannot be undone.
                  </div>

                  <DialogFooter className="mt-4 flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      disabled={isPending}
                      onClick={() => {
                        onDelete({token:auth?.token ?? "",id:row.original.category_id}, {
                          onSuccess(data) {
                            setOpen(false);
                            toast.success(data?.data?.message);
                            queryClient.invalidateQueries({
                              queryKey: ["getAllcategories"],
                            });
                          },
                          onError: (error) => {
                            if (axios.isAxiosError(error)) {
                              toast.error(error?.response?.data?.message);
                            }
                          },
                        });
                      }}
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      },
    ],
    []
  );

  //   const headers = [
  //     { label: "Category", key: "category" },
  //     { label: "Subcategory", key: "subcategory" },
  //     { label: "No. of Products", key: "product_count" },
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

    return (
      customerName.includes(filterValue.toLowerCase()) ||
      phoneNumber.includes(filterValue.toLowerCase())
    );
  };

  const table = useReactTable({
    data: categories,
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

  // if(isError){
  //   content = <p>{error?.response?.data?.message || error?.message}</p>
  // }

  if (isSuccess && Array.isArray(categories)) {
    content = (
      <div className="bg-white rounded-lg p-4  space-y-2">
        <div className="flex flex-col gap-2 py-1">
          <div className="flex flex-row justify-between gap-3 w-full">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by Category Name .... "
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>

            {/* <div className="flex flex-row items-center gap-1">
              <CSVLink data={dummyCategoryData} headers={headers} filename={"orders.csv"}>
                <Button
                  variant="default"
                  className="gap-3 bg-slate-900 hover:bg-slate-900/80"
                >
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
                <DropdownMenuContent
                  className="bg-white overflow-scroll max-h-72"
                  align="end"
                >
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
                          {
                            headers.filter((item) => item.key === column.id)[0]
                              ?.label
                          }
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
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
                        className="  font-semibold text-black text-center"
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
            Showing {table.getFilteredRowModel().rows.length} entries
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
        <Dialog open={Isopen} onOpenChange={setIsopen}>
          <DialogContent className="[&>button]:hidden  overflow-y-scroll !max-h-[40rem] !p-0 !max-w-2xl">
            <DialogHeader className="bg-[#F5F5F5] p-3 rounded-lg items-center w-full flex flex-row  justify-between">
              <DialogTitle className="">Update Category</DialogTitle>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsopen(false);
                }}
              >
                <X className="w-6 h-6" />
              </div>
            </DialogHeader>
            <UpdateCategory Data={selectedCategory} onClose={setIsopen} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (isLoading && typeof categories === "string") {
    content = (
      <p className="font-bold mt-20 text-center capitalize">{categories}</p>
    );
  }

  return content;
}

export default CategoryTable;
