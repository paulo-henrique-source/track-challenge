import { render, screen } from '@testing-library/react'

import { HistoryMapHeader } from './historyMapHeader'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string, values?: Record<string, string | number>) => {
      if (values?.count != null) {
        return `${key}:${values.count}`
      }

      return key
    },
    language: 'pt-BR',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

describe('HistoryMapHeader', () => {
  it('renders map title and points count', () => {
    render(<HistoryMapHeader pointsCount={7} />)

    expect(screen.getByText('map.title')).toBeInTheDocument()
    expect(screen.getByText('map.subtitle')).toBeInTheDocument()
    expect(screen.getByText('map.points:7')).toBeInTheDocument()
  })
})
