import AddCoupon from "@/components/coupon/AddCoupon";
import UpdateCoupon from "@/components/coupon/UpdateCoupon";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/contexts/AuthContext";
import { deleteConfigureCoupons, getConfigureCouponlist } from "@/lib/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import axios from "axios";
import dayjs from "dayjs";
import {
  BadgePercent,
  Edit,
  Loader2,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


function ConfigureCoupons() {
  const [IsAddOpen,setIsAddOpen] = useState(false)
  const {auth} = useAppContext()
  const queryClient = useQueryClient()
  const {
    data: Coupons,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["couponlists"],
    queryFn:()=>getConfigureCouponlist(auth?.token ?? ""),
    select: (data) => data?.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

      const { mutate: onDelete, isPending } = useMutation({
        mutationKey: ["deletecoupon"],
        mutationFn: (args:{token:string,id: number}) => deleteConfigureCoupons(args.token ?? '',args.id),
      });
  
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "coupon_name",
      header: () => "Discount Name",
      cell: ({ row }) => (
        <div className="capitalize flex items-start gap-x-2 text-primary font-semibold">
          <div className=" grid place-items-center rounded-full size-10 bg-[#16A34A1A]/10">
            <BadgePercent className="text-green-500" />
          </div>
          <div>
            {row.getValue("coupon_name")}
            <div className="text-xs text-gray-500">
              {row.original.coupon_code}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "discount_type",
      header: () => "Type",
      cell: ({ row }) => {
        const type = row.getValue("discount_type") as string;

        const badgeClasses: Record<string, string> = {
          flat: "bg-[#3C40AF]/20 text-[#3C40AF]",
          percent: "bg-[#8130A8]/20 text-[#8130A8]",
        };

        return (
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
              badgeClasses[type] || "bg-gray-200 text-gray-600"
            }`}
          >
            {type === "flat" ? "Fixed Amount" : "Percentage"}
          </span>
        );
      },
    },

    {
      accessorKey: "discount",
      header: () => "Value",
      cell: ({ row }) => {
        const type = row.original.discount_type;
        const value = row.getValue("discount");
        return (
          <div>{type === "percent" ? `${value}% OFF` : `₹ ${value} OFF`}</div>
        );
      },
    },
    {
      accessorKey: "usage_count",
      header: () => "Usage",
      cell: ({ row }) => (
        <div>
          {row.getValue("usage_count")}
        </div>
      ),
    },
    {
      accessorKey: "end_at",
      header: () => "Expiry",
      cell: ({ row }) => (
        <div className="capitalize">
          {dayjs(row.getValue("end_at")).format("DD MMM YYYY, hh:mm A")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span
            className={`rounded-full capitalize px-3 py-1 ${
              status === "active"
                ? "bg-green-400/20 text-green-600"
                : "bg-red-400/20 text-red-500"
            }`}
          >
            {`${status}`}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const [Isopen, setIsopen] = useState(false);
        const [IsDeleteOpen, setIsDeleteOpen] = useState(false);
        return (
          <div className="flex items-center gap-3">
            <Dialog open={Isopen} onOpenChange={setIsopen}>
              <DialogTrigger>
                <Button
                  size="icon"
                  className="rounded-full text-[#007AFF] bg-[#007AFF1A]/10 hover:bg-[#007AFF1A]/20"
                >
                  <Edit className="text-green-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className="[&>button]:hidden  !p-0 !max-w-2xl">
                <DialogHeader className="bg-[#F5F5F5] p-3 rounded-lg items-center w-full flex flex-row  justify-between">
                  <DialogTitle className="">
                    Update Coupon {row.original.coupon_name}
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
                <UpdateCoupon onClose={setIsopen} CouponDetails={row.original}/>
              </DialogContent>
            </Dialog>
            <Dialog open={IsDeleteOpen} onOpenChange={setIsDeleteOpen}>
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
                    {row.original.coupon_name}
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
                      onDelete(row.original.coupon_id, {
                        onSuccess(data) {
                          setIsDeleteOpen(false);
                          toast.success(data?.data?.message);
                          queryClient.invalidateQueries({
                            queryKey: ["couponlists"],
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
  ];

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
    const valuesToCheck = [
      row.original.discount_name,
      row.original.coupon_code,
      row.original.type,
      row.original.value,
    ];

    return valuesToCheck.some((val) =>
      val?.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const table = useReactTable({
    data: Coupons?.data || [],
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

  if (isLoading || isFetching) {
    return <div className="mt-[10%] text-center">Loading...</div>;
  }
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Discounts & Coupons</h1>
          <p className="text-xs text-slate-400">
            Manage your store discounts and promotional offers
          </p>
        </div>
        <Dialog open={IsAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <Button>New Discount</Button>
          </DialogTrigger>
          <DialogContent className="[&>button]:hidden  !p-0 !max-w-2xl">
            <DialogHeader className="bg-[#F5F5F5] p-3 rounded-lg items-center w-full flex flex-row  justify-between">
              <DialogTitle className="">
                Add Coupon 
              </DialogTitle>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsAddOpen(false);
                }}
              >
                <X className="w-6 h-6" />
              </div>
            </DialogHeader>
            <AddCoupon onClose={setIsAddOpen}/>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card>
          <CardHeader>
            <div className="text-xl flex flex-row items justify-between">
              <h1>Active Discounts</h1>
              <h1>{Coupons?.dashboard?.active_coupons}</h1>
            </div>
          </CardHeader>
          {/* <CardContent>
            <div className="flex items-center gap-2">
              <ArrowUpFromLine className="stroke-green-400 h-5 w-5" />
              <p> last month</p>
            </div>
          </CardContent> */}
        </Card>
        <Card>
          <CardHeader>
            <div className="text-xl flex flex-row items justify-between">
              <h1>Discount Amount</h1>
                            <h1>{Coupons?.dashboard?.discount_amount ? `₹ ${Coupons?.dashboard?.discount_amount}` : '0' }</h1>

            </div>
          </CardHeader>
         
        </Card>
        <Card>
          <CardHeader>
            <div className="text-xl flex flex-row items justify-between">
              <h1>Coupon Usage</h1>
              <h1> {Coupons?.dashboard?.coupon_usage_count}</h1>
            </div>
          </CardHeader>
        
        </Card>
      </div>

      <div className="border bg-white p-4">
        {/* table comes here */}
        <div className="flex space-y-4 items-center justify-between">
          <div>
            <h1 className=" font-semibold">Active Promotions</h1>
            <p className="text-sm text-lead ">
              Manage your ongoing promotional campaigns
            </p>
          </div>
          <div className="flex  items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 "
                placeholder="Search..."
              />
            </div>

            <Select
              value={
                (table.getColumn("discount_type")?.getFilterValue() as string) ?? "all"
              }
              onValueChange={(value) => {
                table
                  .getColumn("discount_type")
                  ?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flat">Fixed Amount</SelectItem>
                <SelectItem value="percent">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-5">
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
      </div>
    </div>
  );
}

export default ConfigureCoupons;
