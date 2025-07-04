import {  getUsers } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
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

import { User } from "@/types/type";
import { useAppContext } from "@/contexts/AuthContext";
import OrderHistoryDetails from "./OrderHistoryDetails";

function AllOrders() {
//   const queryClinet = useQueryClient();
  const { auth } = useAppContext();
  const {
    data: users,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["getusers"],
    queryFn: () => getUsers(auth?.token ?? ""),
    refetchOnWindowFocus: false,
    select: (data) => data?.data?.users,
  });


  const columns: ColumnDef<User>[] = [
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
      accessorKey: "first_name",
      header: () => "Username",
      cell: ({ row }) => (
        <div className="capitalize text-primary-blue font-semibold">
          {row.getValue("first_name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: () => "Email Address",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: () => "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => "Status",
      cell: ({ row }) => {
        if (row.getValue("status") === "active") {
          return (
            <span className="bg-green-400/25 text-green-400 rounded-full capitalize px-3 py-1">
              {row.getValue("status")}
            </span>
          );
        }

        if (row.getValue("status") === "inactive") {
          return (
            <span className="bg-red-400/25 text-red-400 rounded-full capitalize px-3 py-1">
              {row.getValue("status")}
            </span>
          );
        }
      },
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
                  <DialogTitle className=""> Order Details - ORD-2025-1107</DialogTitle>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setIsopen(false);
                    }}
                  >
                    <X className="w-6 h-6" />
                  </div>
                </DialogHeader>
                <OrderHistoryDetails onClose={setIsopen} HistoryDetails={row.original} />
              </DialogContent>
            </Dialog>

            <Button
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
  });

  const [rowSelection, setRowSelection] = useState({});

  const [globalFilter, setGlobalFilter] = useState("");

  const globalFilterFunction = (
    row: any,
    _columnId: string,
    filterValue: any
  ) => {
    const username = row.original.username?.toLowerCase() || "";

    return username.includes(filterValue.toLowerCase());
  };

  const table = useReactTable({
    data: users,
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

  if (isSuccess && Array.isArray(users)) {
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

  if (isSuccess && typeof users === "string") {
    content = <p className="font-bold mt-20 text-center capitalize">{users}</p>;
  }

  return content;
}

export default AllOrders;
