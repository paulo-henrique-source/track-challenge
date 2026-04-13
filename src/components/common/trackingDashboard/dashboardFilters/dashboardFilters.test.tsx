import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DashboardFilters } from './dashboardFilters'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
    language: 'pt-BR',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

jest.mock('@/components/common/vehicleDropdown/vehicleDropdown', () => ({
  VehicleDropdown: () => <div>VehicleDropdownMock</div>,
}))

jest.mock('@/components/common/packageTypesDropdown/packageTypesDropdown', () => ({
  PackageTypesDropdown: () => <div>PackageTypesDropdownMock</div>,
}))

jest.mock('@/components/ui/datePicker/datePicker', () => ({
  DatePicker: ({ placeholder }: { placeholder?: string }) => <div>{placeholder}</div>,
}))

describe('DashboardFilters', () => {
  const baseProps = {
    vehicles: [],
    packageTypes: [],
    vehicleCode: '',
    packageTypeCodes: [],
    startDate: undefined,
    endDate: undefined,
    minStartDate: undefined,
    maxStartDate: undefined,
    minEndDate: undefined,
    maxEndDate: new Date(),
    isSessionReady: true,
    historyPending: false,
    onVehicleChange: jest.fn(),
    onPackageTypesChange: jest.fn(),
    onStartDateChange: jest.fn(),
    onEndDateChange: jest.fn(),
    onSearch: jest.fn(),
    onClear: jest.fn(),
  }

  it('renders translated labels', () => {
    render(<DashboardFilters {...baseProps} />)

    expect(screen.getByText('filters.title')).toBeInTheDocument()
    expect(screen.getByText('filters.vehicle')).toBeInTheDocument()
    expect(screen.getByText('filters.packageTypes')).toBeInTheDocument()
    expect(screen.getByText('filters.startDatePlaceholder')).toBeInTheDocument()
    expect(screen.getByText('filters.endDatePlaceholder')).toBeInTheDocument()
  })

  it('calls search and clear handlers', async () => {
    const user = userEvent.setup()
    render(<DashboardFilters {...baseProps} />)

    await user.click(screen.getByRole('button', { name: 'filters.search' }))
    await user.click(screen.getByRole('button', { name: 'filters.clear' }))

    expect(baseProps.onSearch).toHaveBeenCalledTimes(1)
    expect(baseProps.onClear).toHaveBeenCalledTimes(1)
  })

  it('shows searching label when pending', () => {
    render(<DashboardFilters {...baseProps} historyPending />)

    expect(screen.getByRole('button', { name: 'filters.searching' })).toBeDisabled()
  })
})
