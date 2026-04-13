import { render, screen } from '@testing-library/react'

import { HistoryMap } from './historyMap'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
    language: 'pt-BR',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

const useHistoryMapMock = jest.fn()

jest.mock('@/hooks/historyMap/useHistoryMap', () => ({
  useHistoryMap: (...args: unknown[]) => useHistoryMapMock(...args),
}))

describe('HistoryMap', () => {
  it('renders empty state when there are no points and not loading', () => {
    useHistoryMapMock.mockReturnValue({
      mapElementRef: { current: null },
      popupElementRef: { current: null },
      pointsCount: 0,
      activePopup: null,
    })

    render(<HistoryMap records={[]} isLoading={false} />)

    expect(screen.getByText('map.empty')).toBeInTheDocument()
  })

  it('renders popup content when active popup is present', () => {
    useHistoryMapMock.mockReturnValue({
      mapElementRef: { current: null },
      popupElementRef: { current: null },
      pointsCount: 2,
      activePopup: {
        label: 'A',
        timestamp: '2026-04-10 10:00:00',
        driver: 'Driver 1',
        coordinate: [0, 0],
      },
    })

    render(<HistoryMap records={[]} isLoading={false} />)

    expect(screen.getByText('map.popup.start')).toBeInTheDocument()
    expect(screen.getByText('Driver 1')).toBeInTheDocument()
  })

  it('hides empty state while loading', () => {
    useHistoryMapMock.mockReturnValue({
      mapElementRef: { current: null },
      popupElementRef: { current: null },
      pointsCount: 0,
      activePopup: null,
    })

    render(<HistoryMap records={[]} isLoading />)

    expect(screen.queryByText('map.empty')).not.toBeInTheDocument()
  })
})
