import { render, screen } from '@testing-library/react'

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover'

jest.mock('@base-ui/react/popover', () => {
  const wrap =
    (Tag: React.ElementType) =>
    ({ children, ...props }: Record<string, unknown>) => {
      return <Tag {...props}>{children as React.ReactNode}</Tag>
    }

  return {
    Popover: {
      Root: wrap('div'),
      Trigger: wrap('button'),
      Portal: wrap('div'),
      Positioner: wrap('div'),
      Popup: wrap('div'),
      Title: wrap('h3'),
      Description: wrap('p'),
    },
  }
})

describe('Popover', () => {
  it('renders all popover parts', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Description</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>,
    )

    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute(
      'data-slot',
      'popover-trigger',
    )
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'popover-title')
    expect(screen.getByText('Description')).toHaveAttribute(
      'data-slot',
      'popover-description',
    )
  })
})
