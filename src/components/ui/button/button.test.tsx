import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from './button'

jest.mock('@base-ui/react/button', () => ({
  Button: ({
    children,
    ...props
  }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
}))

describe('Button', () => {
  it('renders and handles click events', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()

    render(<Button onClick={onClick}>Save</Button>)

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'data-slot',
      'button',
    )
  })
})
