import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PackageTypesDropdown } from './packageTypesDropdown'

let currentLanguage = 'pt-BR'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string, values?: Record<string, string | number>) => {
      if (values?.count != null) {
        return `${currentLanguage}:${key}:${values.count}`
      }

      return `${currentLanguage}:${key}`
    },
    language: currentLanguage,
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

jest.mock('@/components/ui/popover/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button type='button' {...props}>
      {children}
    </button>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('PackageTypesDropdown', () => {
  beforeEach(() => {
    currentLanguage = 'pt-BR'
  })

  it('renders all package types label by default', () => {
    render(
      <PackageTypesDropdown packageTypes={[]} values={[]} onChange={jest.fn()} />,
    )

    expect(screen.getByText('pt-BR:dropdowns.packageTypes.all')).toBeInTheDocument()
    expect(screen.getByText('pt-BR:dropdowns.packageTypes.empty')).toBeInTheDocument()
  })

  it('updates translated label when language changes', () => {
    const { rerender } = render(
      <PackageTypesDropdown packageTypes={[]} values={[]} onChange={jest.fn()} />,
    )

    expect(screen.getByText('pt-BR:dropdowns.packageTypes.all')).toBeInTheDocument()

    currentLanguage = 'en-US'
    rerender(
      <PackageTypesDropdown packageTypes={[]} values={[]} onChange={jest.fn()} />,
    )

    expect(screen.getByText('en-US:dropdowns.packageTypes.all')).toBeInTheDocument()
  })

  it('toggles package type values', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(
      <PackageTypesDropdown
        packageTypes={[
          { pcttcodigo: 'A', pcttnomeresumido: 'Speed' } as never,
          { pcttcodigo: 'B', pcttnomeresumido: 'Location' } as never,
        ]}
        values={['A']}
        onChange={onChange}
      />,
    )

    const speedButtons = screen.getAllByRole('button', { name: 'Speed' })
    await user.click(speedButtons[1])
    expect(onChange).toHaveBeenCalledWith([])

    await user.click(screen.getByRole('button', { name: 'Location' }))
    expect(onChange).toHaveBeenCalledWith(['A', 'B'])
  })
})
