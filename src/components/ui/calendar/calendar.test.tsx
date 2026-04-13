import { render, screen } from '@testing-library/react'

import { Calendar, CalendarDayButton } from './calendar'

jest.mock('@/components/ui/button/button', () => ({
  Button: ({
    children,
    ...props
  }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  buttonVariants: () => 'button-variant',
}))

jest.mock('react-day-picker', () => ({
  DayPicker: ({
    components,
  }: {
    components?: {
      Root?: (props: {
        className?: string
        rootRef?: null
        children?: React.ReactNode
      }) => React.ReactElement
      Chevron?: (props: {
        orientation: 'left' | 'right' | 'down'
      }) => React.ReactElement
      DayButton?: (props: {
        day: { date: Date }
        modifiers: {
          selected: boolean
          range_start: boolean
          range_end: boolean
          range_middle: boolean
          focused: boolean
        }
      }) => React.ReactElement
    }
  }) => {
    const Root =
      components?.Root ??
      ((props: { children?: React.ReactNode }) => <div>{props.children}</div>)

    const Chevron =
      components?.Chevron ??
      (() => <span>Chevron</span>)

    const DayButton =
      components?.DayButton ??
      (() => <button type='button'>Day</button>)

    return (
      <Root className='mock-root' rootRef={null}>
        <Chevron orientation='left' />
        <Chevron orientation='right' />
        <Chevron orientation='down' />
        <DayButton
          day={{ date: new Date('2026-04-12T00:00:00Z') }}
          modifiers={{
            selected: false,
            range_start: false,
            range_end: false,
            range_middle: false,
            focused: false,
          }}
        />
      </Root>
    )
  },
  getDefaultClassNames: () => ({
    root: '',
    months: '',
    month: '',
    nav: '',
    button_previous: '',
    button_next: '',
    month_caption: '',
    dropdowns: '',
    dropdown_root: '',
    dropdown: '',
    caption_label: '',
    weekdays: '',
    weekday: '',
    week: '',
    week_number_header: '',
    week_number: '',
    day: '',
    range_start: '',
    range_middle: '',
    range_end: '',
    today: '',
    outside: '',
    disabled: '',
    hidden: '',
  }),
}))

describe('Calendar', () => {
  it('renders calendar root slot', () => {
    render(<Calendar />)

    expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument()
  })

  it('renders day button attributes', () => {
    render(
      <CalendarDayButton
        day={{ date: new Date('2026-04-12T00:00:00Z') } as never}
        modifiers={{
          selected: true,
          range_start: false,
          range_end: false,
          range_middle: false,
          focused: false,
        }}
      />,
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-selected-single', 'true')
    expect(button).toHaveAttribute('data-day')
  })
})
