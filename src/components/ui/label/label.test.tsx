import { render, screen } from '@testing-library/react'

import { Label } from './label'

describe('Label', () => {
  it('renders label with slot', () => {
    render(<Label htmlFor='field-id'>Field</Label>)

    const label = screen.getByText('Field')
    expect(label).toHaveAttribute('data-slot', 'label')
    expect(label).toHaveAttribute('for', 'field-id')
  })
})
