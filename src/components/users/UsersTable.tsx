import { deleteUser, getUsers, toggleUserStatus } from "@/lib/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";

import { Loader2, MoreVertical, Search, X } from "lucide-react";
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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import EditUserForm from "./EditUserForm";
import { toast } from "sonner";
import axios from "axios";
import { User } from "@/types/type";
import { useAppContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function UsersTable() {
  const queryClinet = useQueryClient();
  const navigate = useNavigate();
  const { auth } = useAppContext();
          const [selectedId, setSelectedId] = useState<number>();

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
  const { mutate: onDelete, isPending } = useMutation({
    mutationKey: ["deleteuser"],
    mutationFn: (args: { token: string; id: string }) =>
      deleteUser(args.token, args.id),
  });

  const { mutate: onToggle , isPending:ToggleIsPending } = useMutation({
    mutationKey: ["toggleuser"],
    mutationFn: (args: { token: string; id: string; status: string }) =>
      toggleUserStatus(args.token, args.id, args.status),
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
      cell: ({ row }) => {
        const { user_id } = row.original;
        return (
          <div
            onClick={() => {
              navigate(`/user-history/${user_id}`);
            }}
            className="capitalize cursor-pointer text-primary-blue font-semibold"
          >
            {row.getValue("first_name")}
          </div>
        );
      },
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
      accessorKey: "last_login",
      header: () => "Last Login",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("last_login") ? (
            row.getValue("last_login")
          ) : (
            <span className="text-muted-foreground ">Never logged in</span>
          )}
        </div>
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
        const role = row.original.role;
        const status = row.original.status;
        const [open, setOpen] = useState(false);
        const [Isopen, setIsopen] = useState(false);

        return (
          <div className="flex flex-row items-center gap-5">
            {selectedId === row.original.user_id && ToggleIsPending ? <div className="">
           <Button  size="icon"
                  variant="ghost">
             <Loader2 className="w-4 h-4 animate-spin" /> 
            </Button>
           
          </div> :
            <Popover>
              <PopoverTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-500 hover:text-primary"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit space-y-2">
                {role !== "customer" && (
                  <Dialog open={Isopen} onOpenChange={setIsopen}>
                    <DialogTrigger>
                      <p
                        className="cursor-pointer text-sm"
                        // className="rounded-full text-green-400 bg-green-400/25 hover:bg-green-400/10"
                      >
                        Edit
                      </p>
                    </DialogTrigger>
                    <DialogContent className="[&>button]:hidden  !p-0 !max-w-xl">
                      <DialogHeader className="bg-[#F5F5F5] p-3 px-6 rounded-lg items-center w-full flex flex-row  justify-between">
                        <DialogTitle className="">
                          {" "}
                          Update User Details
                        </DialogTitle>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setIsopen(false);
                          }}
                        >
                          <X className="w-6 h-6" />
                        </div>
                      </DialogHeader>
                      <EditUserForm
                        userDetails={row.original}
                        onClose={setIsopen}
                      />
                    </DialogContent>
                  </Dialog>
                )}
                <p
                  onClick={() =>
                  {
                    setSelectedId(row.original.user_id)
                    onToggle(
                      {
                        id: String(row.original.user_id),
                        token: auth?.token ?? "",
                        status: status === "active" ? "inactive" : "active",
                      },
                      {
                        onSuccess(data) {
                          toast.success(data?.data?.message);
                          queryClinet.invalidateQueries({
                            queryKey: ["getusers"],
                          });
                        },
                        onError: (error) => {
                          if (axios.isAxiosError(error)) {
                            toast.error(error?.response?.data?.message);
                          }
                        },
                      }
                    )
                  }
                  }
                  className={` text-sm ${
                    status === "active" ? "text-red-500" : "text-green-500"
                  } cursor-pointer `}
                >
                  {" "}
                  
                  {status === "active" ? "Set Inactive" : "Set Active"}{" "}
                </p>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <p
                      className="cursor-pointer text-sm"
                      // className="rounded-full text-red-400 bg-red-400/25 hover:bg-red-400/10"
                    >
                      Delete
                    </p>
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
                        {row.original.first_name} {row.original.last_name}
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
                          onDelete(
                            {
                              token: auth?.token ?? "",
                              id: row.original.user_id.toString(),
                            },
                            {
                              onSuccess(data) {
                                setOpen(false);
                                toast.success(data?.data?.message);
                                queryClinet.invalidateQueries({
                                  queryKey: ["getusers"],
                                });
                              },
                              onError: (error) => {
                                
                                if (axios.isAxiosError(error)) {
                                  toast.error(error?.response?.data?.message);
                                }
                              },
                            }
                          );
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
              </PopoverContent>
            </Popover>
      }
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
    filterValue: string
  ) => {
    const name = row.original.first_name?.toLowerCase() || "";
    const email = row.original.email?.toLowerCase() || "";
    const search = filterValue.trim().toLowerCase();

    return name.includes(search) || email.includes(search);
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
      <div className="bg-white rounded-lg p-4  space-y-2">
        <div className="flex items-center gap-x-3 ">
          <div>
            <h2 className="font-semibold ">User list</h2>
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

export default UsersTable;
