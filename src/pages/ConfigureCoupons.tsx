import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  ArrowUpFromLine,
  BadgePercent,
  Edit,
  LineChart,
  Search,
  TicketPercent,
  Trash2,
} from "lucide-react";
import { useState } from "react";
const data = [
  {
    discount_name: "First Purchase",
    coupon_code: "WELCOME10",
    type: "fixed amount",
    value: "10",
    status: "active",
    usage: "156",
    limit: "1000",
    expiry: "16-07-2025, 09:30",
  },
  {
    discount_name: "Summer Sale 2025",
    coupon_code: "WELCOME10",
    type: "percentage",
    value: "25",
    status: "active",
    usage: "346",
    limit: "1000",
    expiry: "16-07-2025, 09:30",
  },
];

function ConfigureCoupons() {

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "discount_name",
      header: () => "Discount Name",
      cell: ({ row }) => (
        <div className="capitalize flex items-start gap-x-2 text-primary font-semibold">
          <div className=" grid place-items-center rounded-full size-10 bg-[#16A34A1A]/10">
            <BadgePercent className="text-green-500" />
          </div>
          <div>
            {row.getValue("discount_name")}
            <div className="text-xs text-gray-500">
              {row.original.coupon_code}
            </div>
          </div>
        </div>
      ),
    },
  {
  accessorKey: "type",
  header: () => "Type",
  cell: ({ row }) => {
    const type = row.getValue("type") as string;

    const badgeClasses: Record<string, string> = {
      "fixed amount": "bg-[#3C40AF]/20 text-[#3C40AF]",
      "percentage": "bg-[#8130A8]/20 text-[#8130A8]",
    };

    return (
      <span
        className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
          badgeClasses[type] || "bg-gray-200 text-gray-600"
        }`}
      >
        {type}
      </span>
    );
  },
},


    {
      accessorKey: "value",
      header: () => "Value",
      cell: ({ row }) => {
        const type = row.original.type;
        const value = row.getValue("value");
        return <div>{type === "percentage" ? `${value}%` : `₹ ${value}`}</div>;
      },
    },
    {
      accessorKey: "usage",
      header: () => "Usage / Limit",
      cell: ({ row }) => (
        <div>
          {row.getValue("usage")} / {row.original.limit}
        </div>
      ),
    },
    {
      accessorKey: "expiry",
      header: () => "Expiry",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("expiry")}</div>
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
      cell: () => (
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            className="rounded-full text-[#007AFF] bg-[#007AFF1A]/10 hover:bg-[#007AFF1A]/20"
          >
            <Edit className="text-green-500" />
          </Button>
          <Button
            size="icon"
            className="rounded-full text-red-400 bg-red-400/25 hover:bg-red-400/10"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      ),
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
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Discounts & Coupons</h1>
          <p className="text-xs text-slate-400">
            Manage your store discounts and promotional offers
          </p>
        </div>

        <div>
          <Button>New Discount</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card>
          <CardHeader>
            <div className="text-xl flex flex-row items justify-between">
              <h1>Active Discounts</h1>
              <h1>12</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowUpFromLine className="stroke-green-400 h-5 w-5" />
              <p>23% increase from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-xl flex flex-row items justify-between">
              <h1>Total Savings</h1>
              <h1>₹ 15,276</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <LineChart className="stroke-blue-400 h-5 w-5" />
              <p>Based on last 30 days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-xl flex flex-row items justify-between">
              <h1>Coupon Usage</h1>
              <h1>458</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TicketPercent className="stroke-purple-400 h-5 w-5" />
              <p>This month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border bg-white p-4">
        {/* table comes here */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className=" font-semibold">Active Promotions</h1>
            <p className="text-sm text-lead ">
              Manage your ongoing promotional campaigns
            </p>
          </div>
          <div className="flex items-center gap-4">
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
                (table.getColumn("type")?.getFilterValue() as string) ?? "all"
              }
              onValueChange={(value) => {
                table
                  .getColumn("type")
                  ?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fixed amount">Fixed Amount</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
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
