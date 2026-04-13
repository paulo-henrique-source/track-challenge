import { render, screen } from '@testing-library/react'

import { HistoryStateAnalysis } from './historyStateAnalysis'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
    language: 'pt-BR',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

describe('HistoryStateAnalysis', () => {
  it('renders no data message when records are empty', () => {
    render(<HistoryStateAnalysis records={[]} isLoading={false} />)

    expect(screen.getByText('stateAnalysis.noData')).toBeInTheDocument()
  })

  it('renders percentages for open and closed states', () => {
    render(
      <HistoryStateAnalysis
        records={[
          { estado: 'aberto', latitude: '0', longitude: '0', data: 'x' } as never,
          { estado: 'fechado', latitude: '0', longitude: '0', data: 'x' } as never,
        ]}
        isLoading={false}
      />, 
    )

    expect(screen.getByText('stateAnalysis.title')).toBeInTheDocument()
    expect(screen.getByText('stateAnalysis.open')).toBeInTheDocument()
    expect(screen.getByText('stateAnalysis.closed')).toBeInTheDocument()
    expect(screen.getAllByText('50% (1)')).toHaveLength(2)
  })

  it('renders loading skeleton state', () => {
    const { container } = render(<HistoryStateAnalysis records={[]} isLoading />)

    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
  })
})
