import { getAllOrders } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";

import {

  Search,
  SquarePen,
  UserRoundX,
  X,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import EditUserForm from "./EditUserForm";

const data = [
  {
    username: "Ramanan",
    email: "ramanan1633@gmail.com",
    role: "admin",
    lastLogin: "18-07-2025, 13:50",
    status: "active",
  },
  {
    username: "Priya",
    email: "priya.k@example.com",
    role: "editor",
    lastLogin: "15-07-2025, 09:30",
    status: "inactive",
  },
  {
    username: "Arjun",
    email: "arjun.m@example.com",
    role: "viewer",
    lastLogin: "16-07-2025, 21:10",
    status: "active",
  },
  {
    username: "Meera",
    email: "meera.singh@example.com",
    role: "admin",
    lastLogin: "17-07-2025, 11:25",
    status: "active",
  },
  {
    username: "Vikram",
    email: "vikram.r@example.com",
    role: "editor",
    lastLogin: "12-07-2025, 14:50",
    status: "inactive",
  },
  {
    username: "Aisha",
    email: "aisha.z@example.com",
    role: "viewer",
    lastLogin: "14-07-2025, 18:15",
    status: "active",
  },
];

function UsersTable() {
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
  const [Isopen, setIsopen] = useState(false);

  const [rowSelection, setRowSelection] = useState({});

  const [globalFilter, setGlobalFilter] = useState("");
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
      header: () => "Username",
      cell: ({ row }) => (
        <div className="capitalize text-primary-blue font-semibold">
          {row.getValue("username")}
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
      accessorKey: "lastLogin",
      header: () => "Last Login",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("lastLogin")}</div>
      ),
    },

    {
      accessorKey: "actions",
      header: () => "Actions",
      enableHiding: false,
      cell: () => (
        <div className="flex flex-row items-center gap-5">
          <Dialog open={Isopen} onOpenChange={setIsopen}>
            <DialogTrigger>
              <Button
                size={"icon"}
                className="rounded-full text-green-400 bg-green-400/25 hover:bg-green-400/10"
              >
                <SquarePen className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="[&>button]:hidden  !p-0 !max-w-xl">
              <DialogHeader className="bg-[#F5F5F5] p-3 px-6 rounded-lg items-center w-full flex flex-row  justify-between">
                <DialogTitle className=""> Update User Details</DialogTitle>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setIsopen(false);
                  }}
                >
                  <X className="w-6 h-6" />
                </div>
              </DialogHeader>
              <EditUserForm onClose={setIsopen} />
            </DialogContent>
          </Dialog>

          <Button
            size={"icon"}
            className="rounded-full text-red-400 bg-red-400/25 hover:bg-red-400/10"
          >
            <UserRoundX className="h-5 w-5" />
          </Button>
        </div>
      ),
    },
  ];
  const globalFilterFunction = (
    row: any,
    _columnId: string,
    filterValue: any
  ) => {
    const username = row.original.username?.toLowerCase() || "";

    return username.includes(filterValue.toLowerCase());
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
        <div className="flex items-center gap-x-3 ">
          <div>
            <h2 className="font-semibold ">User list</h2>
            <p className="text-lead text-sm">21 users found</p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users    .... "
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>
          {/* Role Filter */}
          <div className="w-[180px]">
            <Select
              onValueChange={(value) =>
                table
                  .getColumn("role")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
              value={
                (table.getColumn("role")?.getFilterValue() as string) ?? "all"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Array.from(
                  table.getColumn("role")?.getFacetedUniqueValues()?.keys() ??
                    []
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
                (table.getColumn("status")?.getFilterValue() as string) ?? "all"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Array.from(
                  table.getColumn("status")?.getFacetedUniqueValues()?.keys() ??
                    []
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

export default UsersTable;
