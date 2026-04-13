import { render, screen } from '@testing-library/react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

describe('Table', () => {
  it('renders all table sections with expected slots', () => {
    const { container } = render(
      <Table>
        <TableCaption>Summary</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>2026-04-12</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )

    expect(container.querySelector('[data-slot="table-container"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument()
    expect(screen.getByText('Date')).toHaveAttribute('data-slot', 'table-head')
    expect(screen.getByText('2026-04-12')).toHaveAttribute('data-slot', 'table-cell')
    expect(screen.getByText('Total')).toHaveAttribute('data-slot', 'table-cell')
    expect(screen.getByText('Summary')).toHaveAttribute('data-slot', 'table-caption')
  })
})
