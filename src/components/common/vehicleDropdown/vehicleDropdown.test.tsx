import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { VehicleDropdown } from './vehicleDropdown'

let currentLanguage = 'pt-BR'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => `${currentLanguage}:${key}`,
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

jest.mock('@/components/ui/button/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button type='button' {...props}>
      {children}
    </button>
  ),
}))

describe('VehicleDropdown', () => {
  beforeEach(() => {
    currentLanguage = 'pt-BR'
  })

  it('renders placeholder when no value is selected', () => {
    render(
      <VehicleDropdown vehicles={[]} value='' onChange={jest.fn()} triggerId='vehicle-trigger' />,
    )

    expect(screen.getByText('pt-BR:dropdowns.vehicle.placeholder')).toBeInTheDocument()
    expect(screen.getByText('pt-BR:dropdowns.vehicle.empty')).toBeInTheDocument()
  })

  it('updates placeholder translation when language changes', () => {
    const { rerender } = render(
      <VehicleDropdown vehicles={[]} value='' onChange={jest.fn()} triggerId='vehicle-trigger' />,
    )

    expect(screen.getByText('pt-BR:dropdowns.vehicle.placeholder')).toBeInTheDocument()

    currentLanguage = 'en-US'
    rerender(
      <VehicleDropdown vehicles={[]} value='' onChange={jest.fn()} triggerId='vehicle-trigger' />,
    )

    expect(screen.getByText('en-US:dropdowns.vehicle.placeholder')).toBeInTheDocument()
  })

  it('calls onChange when selecting a vehicle', async () => {
    const onChange = jest.fn()
    const user = userEvent.setup()

    render(
      <VehicleDropdown
        vehicles={[
          { veiccodigo: '1', veicnome: 'Truck A' } as never,
          { veiccodigo: '2', veicnome: 'Truck B' } as never,
        ]}
        value=''
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Truck A' }))

    expect(onChange).toHaveBeenCalledWith('1')
  })
})
