import { PaymentHistoryResponseType } from "@/types"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import { Badge } from "../ui/badge";
import DownloadInvoice from "./DownloadInvoice";

const columns: ColumnDef<PaymentHistoryResponseType>[] = [
    {
      accessorKey: "payment_id",
      header: "Payment ID",
      cell: ({ row }) => (
        <div className="capitalize">{(row.getValue("payment_id")? row.getValue("payment_id"):'-') }</div>
      ),
      
    },
    {
      accessorKey: "nplan_name",
      header: "Plan Name",
      cell: ({ row }) => (
        <div className="capitalize">{(row.getValue("plan_name")? row.getValue("plan_name"):'-') }</div>
      ),
      
    },

   
    {
      accessorKey: "payment_on",
      header: "Payment On",
      cell: ({ row }) => (
        <div className="capitalize">{(row.getValue("payment_on")? row.getValue("payment_on"):'-') }</div>

      ),
    },
    {
      accessorKey: "method",
      header: "Payment Mode",
      cell: ({ row }) => (
        <div className="capitalize">{(row.getValue("method")? row.getValue("method"):'-') }</div>

      ),
    },
    {
      accessorKey: "payment_date",
      header: "Date of Payment",
      cell: ({ row }) => (
        <div className="capitalize">{(dayjs(row.getValue("payment_date")).format("DD-MM-YYYY"))?(dayjs(row.getValue("payment_date")).format("DD-MM-YYYY")):'-'}</div>
      ),
    },
    {
      accessorKey: "validity_from",
      header: "Valid From",
      cell: ({ row }) => (
        <div className="capitalize">{(row.getValue("validity_from")? row.getValue("validity_from"):'-') }</div>

      ),
    },
    {
      accessorKey: "validity_to",
      header: "Valid Till",
      cell: ({ row }) => (
        <div className="capitalize">{(row.getValue("validity_to")? row.getValue("validity_to"):'-') }</div>

      ),
    },
    {
      accessorKey: "amount_paid",
      header: "Amount Paid",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("currency_symbol")} {row.getValue("amount_paid") as number}</div>
      ),
    },
    {
      accessorKey: "payment_status",
      header: "Payment Status",
      cell: ({ row }) => {
        if(row.getValue("payment_status") === "success"){
            return <Badge className="bg-green-400 hover:bg-green-500">{row.getValue("payment_status")}</Badge>
        }
      },
    },
    {
      accessorKey: "payment_id",
      header: "Download Invoice",
      cell: ({ row }) => (
        <DownloadInvoice paymentId={row.getValue("payment_id")} paymentOn={row.getValue("payment_on")}/>
      ),
    }
];

function PaymentTable({ data }: { data: PaymentHistoryResponseType[] }) {
  console.log(data);
  

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
      payment_on: false
    });
    const [rowSelection, setRowSelection] = useState({});
    
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

  return (
    <div className="w-full">
        <div className="rounded-md border overflow-hidden mt-5">
        <Table className="bg-white dark:bg-slate-950">
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead className="font-medium text-black" key={header.id}>
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
            {table.getFilteredRowModel().rows.length} row(s).
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

export default PaymentTable