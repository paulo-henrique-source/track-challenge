import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders textarea and allows typing', async () => {
    const user = userEvent.setup()

    render(<Textarea placeholder='Write here' />)

    const textarea = screen.getByPlaceholderText('Write here')
    expect(textarea).toHaveAttribute('data-slot', 'textarea')

    await user.type(textarea, 'hello world')
    expect(textarea).toHaveValue('hello world')
  })
})
