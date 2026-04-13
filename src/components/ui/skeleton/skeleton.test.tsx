import { render, screen } from '@testing-library/react'

import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders with skeleton slot and base classes', () => {
    render(<Skeleton data-testid='skeleton' className='h-4 w-8' />)

    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton')
    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('h-4')
    expect(skeleton).toHaveClass('w-8')
  })
})
