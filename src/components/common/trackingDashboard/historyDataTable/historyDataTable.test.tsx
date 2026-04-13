import { render, screen } from '@testing-library/react'

import { HistoryDataTable } from './historyDataTable'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string, values?: Record<string, string | number>) => {
      if (values) {
        const suffix = Object.entries(values)
          .map(([entryKey, entryValue]) => `${entryKey}:${entryValue}`)
          .join(',')

        return `${key}:${suffix}`
      }

      return key
    },
    language: 'pt-BR',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

jest.mock('@/components/ui/dropdownMenu/dropdownMenu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button type='button' {...props}>
      {children}
    </button>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuCheckboxItem: ({
    children,
    onCheckedChange,
    checked,
  }: {
    children: React.ReactNode
    checked?: boolean
    onCheckedChange?: (value: boolean) => void
  }) => (
    <button type='button' onClick={() => onCheckedChange?.(!checked)}>
      {children}
    </button>
  ),
}))

describe('HistoryDataTable', () => {
  it('renders empty state for no records', () => {
    render(<HistoryDataTable records={[]} isLoading={false} />)

    expect(screen.getByText('table.title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('table.searchPlaceholder')).toBeInTheDocument()
    expect(screen.getByText('table.noRecords')).toBeInTheDocument()
  })

  it('renders data row when records exist', () => {
    render(
      <HistoryDataTable
        records={[
          {
            data: '2026-04-10 10:00:00',
            estado: 'aberto',
            motorista: 'Driver',
            velocidade: '80',
            tipo: 'GPS',
            latitude: '-22.90',
            longitude: '-43.17',
          } as never,
        ]}
      />,
    )

    expect(screen.getByText('2026-04-10 10:00:00')).toBeInTheDocument()
    expect(screen.getByText('Driver')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
  })

  it('renders loading skeletons when loading', () => {
    const { container } = render(<HistoryDataTable records={[]} isLoading />)

    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
  })
})
