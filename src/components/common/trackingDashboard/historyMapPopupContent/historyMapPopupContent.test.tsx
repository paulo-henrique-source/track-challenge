import { render, screen } from '@testing-library/react'

import { HistoryMapPopupContent } from './historyMapPopupContent'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
    language: 'pt-BR',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

describe('HistoryMapPopupContent', () => {
  it('renders start marker popup details', () => {
    render(
      <HistoryMapPopupContent
        popup={{
          label: 'A',
          timestamp: '2026-04-10 12:30:00',
          driver: 'John',
          coordinate: [0, 0],
        }}
      />,
    )

    expect(screen.getByText('map.popup.start')).toBeInTheDocument()
    expect(screen.getByText(/2026-04-10 \| 12:30:00/)).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('renders end marker label for B', () => {
    render(
      <HistoryMapPopupContent
        popup={{
          label: 'B',
          timestamp: '2026-04-10 12:30:00',
          driver: 'John',
          coordinate: [0, 0],
        }}
      />,
    )

    expect(screen.getByText('map.popup.end')).toBeInTheDocument()
  })
})
