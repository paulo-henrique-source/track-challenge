import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DashboardHeader } from './dashboardHeader'

const setLanguageMock = jest.fn()
const setPreferredDarkModeMock = jest.fn()

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
    language: 'pt-BR',
    setLanguage: setLanguageMock,
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

jest.mock('@/utils/theme', () => ({
  getPreferredDarkMode: () => true,
  setPreferredDarkMode: (...args: unknown[]) => setPreferredDarkModeMock(...args),
}))

describe('DashboardHeader', () => {
  beforeEach(() => {
    setLanguageMock.mockClear()
    setPreferredDarkModeMock.mockClear()
    document.documentElement.classList.remove('dark')
  })

  it('renders i18n labels and language select', () => {
    render(<DashboardHeader />)

    expect(screen.getByText('header.language.label')).toBeInTheDocument()
    expect(screen.getByText('common.fleetUser')).toBeInTheDocument()
    expect(screen.getByText('common.appName')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'header.language.triggerAria' })).toBeInTheDocument()
  })

  it('calls setLanguage on language change', async () => {
    const user = userEvent.setup()
    render(<DashboardHeader />)

    const select = screen.getByRole('combobox', {
      name: 'header.language.triggerAria',
    })

    await user.selectOptions(select, 'en-US')

    expect(setLanguageMock).toHaveBeenCalledWith('en-US')
  })

  it('applies dark class on mount based on preferred mode', async () => {
    render(<DashboardHeader />)

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })
})
