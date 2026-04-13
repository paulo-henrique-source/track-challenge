import { render, screen } from '@testing-library/react'

import { TrackingDashboard } from './trackingDashboard'

jest.mock('next/dynamic', () => {
  return () => {
    const MockHistoryMap = ({ records, isLoading }: { records: unknown[]; isLoading: boolean }) => (
      <div>
        HistoryMapMock:{records.length}:{String(isLoading)}
      </div>
    )

    return MockHistoryMap
  }
})

jest.mock('@/hooks/useTrackingDashboard', () => ({
  useTrackingDashboard: () => ({
    vehicles: [{ veiccodigo: '1' }],
    packageTypes: [{ pcttcodigo: 'A' }],
    isSessionReady: true,
    onlineVehiclesCount: 3,
    historyRecords: [{ data: 'x', latitude: '0', longitude: '0' }],
    historyRecordsCount: 1,
    historyPending: false,
    vehicleCode: '',
    packageTypeCodes: [],
    startDate: undefined,
    endDate: undefined,
    minStartDate: undefined,
    maxStartDate: undefined,
    minEndDate: undefined,
    maxEndDate: new Date(),
    setVehicleCode: jest.fn(),
    setPackageTypeCodes: jest.fn(),
    setStartDate: jest.fn(),
    setEndDate: jest.fn(),
    submitHistory: jest.fn(),
    clearFilters: jest.fn(),
  }),
}))

jest.mock(
  '@/components/common/trackingDashboard/dashboardHeader/dashboardHeader',
  () => ({
  DashboardHeader: () => <div>DashboardHeaderMock</div>,
  }),
)

jest.mock(
  '@/components/common/trackingDashboard/dashboardKpiGrid/dashboardKpiGrid',
  () => ({
  DashboardKpiGrid: ({
    vehiclesCount,
    packageTypesCount,
    historyRecordsCount,
    onlineVehiclesCount,
  }: {
    vehiclesCount: number
    packageTypesCount: number
    historyRecordsCount: number
    onlineVehiclesCount: number
  }) => (
    <div>
      DashboardKpiGridMock:{vehiclesCount}:{packageTypesCount}:{historyRecordsCount}:{onlineVehiclesCount}
    </div>
  ),
  }),
)

jest.mock(
  '@/components/common/trackingDashboard/dashboardFilters/dashboardFilters',
  () => ({
  DashboardFilters: () => <div>DashboardFiltersMock</div>,
  }),
)

jest.mock(
  '@/components/common/trackingDashboard/historyStateAnalysis/historyStateAnalysis',
  () => ({
  HistoryStateAnalysis: ({ records }: { records: unknown[] }) => (
    <div>HistoryStateAnalysisMock:{records.length}</div>
  ),
  }),
)

jest.mock(
  '@/components/common/trackingDashboard/historyDataTable/historyDataTable',
  () => ({
  HistoryDataTable: ({ records }: { records: unknown[] }) => (
    <div>HistoryDataTableMock:{records.length}</div>
  ),
  }),
)

describe('TrackingDashboard', () => {
  it('renders all dashboard sections and passes aggregated data', () => {
    render(<TrackingDashboard />)

    expect(screen.getByText('DashboardHeaderMock')).toBeInTheDocument()
    expect(screen.getByText('DashboardFiltersMock')).toBeInTheDocument()

    expect(
      screen.getByText('DashboardKpiGridMock:1:1:1:3'),
    ).toBeInTheDocument()
    expect(screen.getByText('HistoryMapMock:1:false')).toBeInTheDocument()
    expect(screen.getByText('HistoryStateAnalysisMock:1')).toBeInTheDocument()
    expect(screen.getByText('HistoryDataTableMock:1')).toBeInTheDocument()
  })
})
