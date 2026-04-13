import { render, screen } from '@testing-library/react'

import { Separator } from './separator'

jest.mock('@base-ui/react/separator', () => ({
  Separator: ({ children, ...props }: React.ComponentProps<'div'>) => {
    return <div {...props}>{children}</div>
  },
}))

describe('Separator', () => {
  it('renders with default horizontal orientation', () => {
    render(<Separator data-testid='separator' />)

    const separator = screen.getByTestId('separator')
    expect(separator).toHaveAttribute('data-slot', 'separator')
    expect(separator).toHaveAttribute('orientation', 'horizontal')
  })

  it('accepts vertical orientation', () => {
    render(<Separator data-testid='separator' orientation='vertical' />)

    expect(screen.getByTestId('separator')).toHaveAttribute('orientation', 'vertical')
  })
})
