"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HistoryRecord } from "@/types/history";

type HistoryDataTableProps = {
  records: HistoryRecord[];
};

type HistoryTableRow = {
  data: string;
  estado: string;
  motorista: string;
  velocidade: string;
  tipo: string;
  latitude: string;
  longitude: string;
};

const PAGE_SIZE = 15;

function normalizeTableValue(value: string | undefined) {
  if (value == null || value.length === 0) {
    return "-";
  }

  return value;
}

function getSortIcon(sortDirection: false | "asc" | "desc") {
  if (sortDirection === false) {
    return <ArrowUpDown className="size-3.5" />;
  }

  if (sortDirection === "asc") {
    return <ArrowUp className="size-3.5" />;
  }

  return <ArrowDown className="size-3.5" />;
}

export function HistoryDataTable({ records }: HistoryDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "data", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const rows = useMemo<HistoryTableRow[]>(() => {
    return records.map((record) => ({
      data: record.data,
      estado: normalizeTableValue(record.estado),
      motorista: normalizeTableValue(record.motorista),
      velocidade: normalizeTableValue(record.velocidade),
      tipo: normalizeTableValue(record.tipo),
      latitude: record.latitude,
      longitude: record.longitude,
    }));
  }, [records]);

  const columns = useMemo<ColumnDef<HistoryTableRow>[]>(
    () => [
      {
        accessorKey: "data",
        header: ({ column }) => (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            Date/Time
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "estado",
        header: ({ column }) => (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            State
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "motorista",
        header: ({ column }) => (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            Driver
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "velocidade",
        header: ({ column }) => (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            Speed
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "tipo",
        header: ({ column }) => (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            Type
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "latitude",
        header: ({ column }) => (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            Latitude
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "longitude",
        header: ({ column }) => (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            Longitude
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: PAGE_SIZE,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className='surface-card overflow-hidden'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Raw Data (Sortable)</CardTitle>
        <CardDescription>
          {records.length} records found. Paginated rendering to keep the UI
          responsive.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="search"
            value={globalFilter}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value);
              table.setPageIndex(0);
            }}
            placeholder="Search records..."
            className="h-9 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring sm:max-w-xs"
          />

          <label className="inline-flex items-center gap-2 text-sm text-[color:var(--text-subtle)]">
            Rows per page
            <select
              value={table.getState().pagination.pageSize}
              onChange={(event) => {
                table.setPageSize(Number(event.target.value));
                table.setPageIndex(0);
              }}
              className="h-9 rounded-sm border border-input bg-background px-2 text-sm text-[color:var(--text-strong)] outline-none focus-visible:border-ring"
            >
              {[10, 15, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        {table.getFilteredRowModel().rows.length === 0 ? (
          <p className="text-sm text-[color:var(--text-subtle)]">
            No records to display.
          </p>
        ) : null}

        <div className="overflow-hidden rounded-sm border border-border">
          <div className="max-h-[520px] overflow-auto lg:max-h-[680px]">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-[color:var(--surface-card)]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border-b border-border px-3 py-2 text-left font-semibold text-[color:var(--text-strong)]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="odd:bg-[color:var(--surface-elevated)]/40"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border-b border-border px-3 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[color:var(--text-subtle)]">
            {table.getFilteredRowModel().rows.length} filtered records •{" "}
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.previousPage();
              }}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage();
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
