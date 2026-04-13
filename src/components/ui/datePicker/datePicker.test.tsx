import { fireEvent, render, screen } from '@testing-library/react'

import { DatePicker } from './datePicker'

jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => ({
    t: (key: string) => key,
    language: 'pt-BR',
    setLanguage: jest.fn(),
    hasTranslation: jest.fn(),
    supportedLanguages: ['pt-BR', 'en-US'],
  }),
}))

jest.mock('@/components/ui/popover/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({
    children,
    ...props
  }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/ui/calendar/calendar', () => ({
  Calendar: () => <div>CalendarMock</div>,
}))

describe('DatePicker', () => {
  it('renders placeholder when no date is selected', () => {
    render(<DatePicker placeholder='Pick a day' />)

    expect(screen.getByRole('button', { name: /pick a day/i })).toBeInTheDocument()
    expect(screen.getByText('CalendarMock')).toBeInTheDocument()
  })

  it('renders time input when showTime is true', () => {
    const onChange = jest.fn()
    const value = new Date('2026-04-12T10:00:00Z')

    render(<DatePicker value={value} onChange={onChange} showTime />)

    expect(screen.getByText('datePicker.time')).toBeInTheDocument()

    const input = document.querySelector('input[type="time"]') as HTMLInputElement | null
    if (input == null) {
      throw new Error('Time input not found')
    }

    fireEvent.change(input, { target: { value: '11:30' } })

    expect(onChange).toHaveBeenCalled()
    const dateResult = onChange.mock.calls.at(-1)?.[0] as Date
    expect(dateResult).toBeInstanceOf(Date)
    expect(dateResult.getHours()).toBe(11)
    expect(dateResult.getMinutes()).toBe(30)
  })
})
