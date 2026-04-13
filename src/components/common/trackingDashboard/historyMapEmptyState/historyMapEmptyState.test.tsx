import { render, screen } from '@testing-library/react'

import { HistoryMapEmptyState } from './historyMapEmptyState'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
    language: 'pt-BR',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

describe('HistoryMapEmptyState', () => {
  it('renders empty state text', () => {
    render(<HistoryMapEmptyState />)

    expect(screen.getByText('map.empty')).toBeInTheDocument()
  })
})
