import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { Badge } from './badge'

jest.mock('@base-ui/react/merge-props', () => ({
  mergeProps: (...objects: Array<Record<string, unknown>>) => {
    return Object.assign({}, ...objects)
  },
}))

jest.mock('@base-ui/react/use-render', () => ({
  useRender: ({
    defaultTagName,
    props,
    state,
  }: {
    defaultTagName: React.ElementType
    props: Record<string, unknown>
    state: { slot?: string }
  }) => {
    return React.createElement(
      defaultTagName,
      {
        ...props,
        'data-slot': state.slot,
      },
      props.children as React.ReactNode,
    )
  },
}))

describe('Badge', () => {
  it('renders badge with slot and content', () => {
    render(<Badge variant='secondary'>Status</Badge>)

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Status')).toHaveAttribute('data-slot', 'badge')
  })
})
