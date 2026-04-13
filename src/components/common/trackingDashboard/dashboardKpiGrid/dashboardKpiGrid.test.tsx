import { render, screen } from '@testing-library/react'

import { DashboardKpiGrid } from './dashboardKpiGrid'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
    language: 'en-US',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

describe('DashboardKpiGrid', () => {
  it('renders KPI labels and formatted numbers', () => {
    render(
      <DashboardKpiGrid
        vehiclesCount={1000}
        packageTypesCount={2000}
        historyRecordsCount={3000}
        onlineVehiclesCount={4000}
      />,
    )

    expect(screen.getByText('kpi.vehiclesLoaded')).toBeInTheDocument()
    expect(screen.getByText('kpi.packageTypes')).toBeInTheDocument()
    expect(screen.getByText('kpi.latestRecords')).toBeInTheDocument()
    expect(screen.getByText('kpi.vehiclesOnline')).toBeInTheDocument()

    expect(screen.getByText('1,000')).toBeInTheDocument()
    expect(screen.getByText('2,000')).toBeInTheDocument()
    expect(screen.getByText('3,000')).toBeInTheDocument()
    expect(screen.getByText('4,000')).toBeInTheDocument()
  })
})
