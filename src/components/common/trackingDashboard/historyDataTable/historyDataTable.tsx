"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
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
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu/dropdownMenu";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import { useTranslate } from "@/hooks/useTranslate";
import type { HistoryRecord } from "@/types/history";

type HistoryDataTableProps = {
  records: HistoryRecord[];
  isLoading?: boolean;
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
const COLUMN_SELECTOR_TRIGGER_ID = "history-table-columns-trigger";
const COLUMN_LABEL_KEYS: Record<keyof HistoryTableRow, string> = {
  data: "table.column.dateTime",
  estado: "table.column.state",
  motorista: "table.column.driver",
  velocidade: "table.column.speed",
  tipo: "table.column.type",
  latitude: "table.column.latitude",
  longitude: "table.column.longitude",
};

function normalizeTableValue(value: string | undefined) {
  if (value == null || value.length === 0) {
    return "-";
  }

  return value;
}

function getSortIcon(sortDirection: false | "asc" | "desc") {
  if (sortDirection === false) {
    return <ArrowUpDown className='size-3.5' />;
  }

  if (sortDirection === "asc") {
    return <ArrowUp className='size-3.5' />;
  }

  return <ArrowDown className='size-3.5' />;
}

export function HistoryDataTable({
  records,
  isLoading = false,
}: HistoryDataTableProps) {
  const { t } = useTranslate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "data", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
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
            type='button'
            onClick={column.getToggleSortingHandler()}
            className='inline-flex cursor-pointer items-center gap-1.5'>
            {t("table.column.dateTime")}
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "estado",
        header: ({ column }) => (
          <button
            type='button'
            onClick={column.getToggleSortingHandler()}
            className='inline-flex cursor-pointer items-center gap-1.5'>
            {t("table.column.state")}
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "motorista",
        header: ({ column }) => (
          <button
            type='button'
            onClick={column.getToggleSortingHandler()}
            className='inline-flex cursor-pointer items-center gap-1.5'>
            {t("table.column.driver")}
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "velocidade",
        header: ({ column }) => (
          <button
            type='button'
            onClick={column.getToggleSortingHandler()}
            className='inline-flex cursor-pointer items-center gap-1.5'>
            {t("table.column.speed")}
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "tipo",
        header: ({ column }) => (
          <button
            type='button'
            onClick={column.getToggleSortingHandler()}
            className='inline-flex cursor-pointer items-center gap-1.5'>
            {t("table.column.type")}
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "latitude",
        header: ({ column }) => (
          <button
            type='button'
            onClick={column.getToggleSortingHandler()}
            className='inline-flex cursor-pointer items-center gap-1.5'>
            {t("table.column.latitude")}
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
      {
        accessorKey: "longitude",
        header: ({ column }) => (
          <button
            type='button'
            onClick={column.getToggleSortingHandler()}
            className='inline-flex cursor-pointer items-center gap-1.5'>
            {t("table.column.longitude")}
            {getSortIcon(column.getIsSorted())}
          </button>
        ),
      },
    ],
    [t],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
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
    <Card className='surface-card animate-in fade-in-0 slide-in-from-bottom-2 overflow-hidden duration-500'>
      <CardHeader className='pb-3'>
        <CardTitle className='cursor-text text-base'>
          {t("table.title")}
        </CardTitle>
        <CardDescription className='cursor-text'>
          {t("table.description", { count: records.length })}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3'>
        {isLoading ? (
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <Skeleton className='h-9 w-full sm:max-w-xs' />
              <Skeleton className='h-9 w-32' />
            </div>
            <Skeleton className='h-[520px] w-full rounded-sm lg:h-[680px]' />
            <div className='flex items-center justify-between gap-2'>
              <Skeleton className='h-4 w-44' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-20' />
              </div>
            </div>
          </div>
        ) : null}

        {!isLoading && (
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <input
              type='search'
              value={globalFilter}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
                table.setPageIndex(0);
              }}
              placeholder={t("table.searchPlaceholder")}
              className='h-9 w-full cursor-text rounded-sm border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring sm:max-w-xs dark:border-input dark:bg-input/30 dark:hover:bg-input/50'
            />

            <div className='flex flex-wrap items-center gap-2'>
              <label className='inline-flex cursor-text items-center gap-2 text-sm text-[color:var(--text-subtle)]'>
                {t("table.rowsPerPage")}
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(event) => {
                    table.setPageSize(Number(event.target.value));
                    table.setPageIndex(0);
                  }}
                  className='h-9 cursor-pointer rounded-sm border border-input bg-background px-2 text-sm text-[color:var(--text-strong)] outline-none transition focus-visible:border-ring dark:border-input dark:bg-input/30 dark:hover:bg-input/50'>
                  {[10, 15, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  id={COLUMN_SELECTOR_TRIGGER_ID}
                  className='inline-flex h-9 cursor-pointer items-center gap-1 rounded-sm border border-input bg-background px-3 text-sm text-[color:var(--text-strong)] outline-none transition hover:bg-muted hover:text-foreground focus-visible:border-ring aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50'>
                  {t("table.columns")}
                  <ChevronDown className='size-3.5 text-muted-foreground' />
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuLabel className='cursor-text'>
                    {t("table.toggleColumns")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        className='cursor-pointer'
                        disabled={
                          table.getVisibleLeafColumns().length <= 1 &&
                          column.getIsVisible()
                        }
                        onCheckedChange={(checked) => {
                          column.toggleVisibility(checked);
                        }}>
                        <span className='cursor-text'>
                          {column.id in COLUMN_LABEL_KEYS
                            ? t(
                                COLUMN_LABEL_KEYS[
                                  column.id as keyof HistoryTableRow
                                ],
                              )
                            : column.id}
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {!isLoading && table.getFilteredRowModel().rows.length === 0 ? (
          <p className='cursor-text text-sm text-[color:var(--text-subtle)]'>
            {t("table.noRecords")}
          </p>
        ) : null}

        {!isLoading && (
          <div className='overflow-hidden rounded-sm border border-border'>
            <div className='max-h-[520px] overflow-auto lg:max-h-[680px]'>
              <Table className='min-w-[900px] border-collapse text-sm'>
                <TableHeader className='sticky top-0 z-10 bg-[color:var(--surface-card)]'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className='border-b border-border px-3 py-2 text-left font-semibold text-[color:var(--text-strong)]'>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className='cursor-text border-b border-border px-3 py-2'>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className='flex items-center justify-between gap-2'>
            <p className='cursor-text text-xs text-[color:var(--text-subtle)]'>
              {t("table.paginationSummary", {
                count: table.getFilteredRowModel().rows.length,
                current: table.getState().pagination.pageIndex + 1,
                total: Math.max(1, table.getPageCount()),
              })}
            </p>

            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='cursor-pointer'
                disabled={!table.getCanPreviousPage()}
                onClick={() => {
                  table.previousPage();
                }}>
                {t("table.previous")}
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='cursor-pointer'
                disabled={!table.getCanNextPage()}
                onClick={() => {
                  table.nextPage();
                }}>
                {t("table.next")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
