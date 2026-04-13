import { render, screen } from '@testing-library/react'

import { Input } from './input'

jest.mock('@base-ui/react/input', () => ({
  Input: ({ ...props }: React.ComponentProps<'input'>) => <input {...props} />,
}))

describe('Input', () => {
  it('renders input with data-slot', () => {
    render(<Input placeholder='Search...' />)

    const input = screen.getByPlaceholderText('Search...')
    expect(input).toHaveAttribute('data-slot', 'input')
  })
})
