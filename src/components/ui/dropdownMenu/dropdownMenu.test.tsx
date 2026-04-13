import { render, screen } from '@testing-library/react'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdownMenu'

jest.mock('@base-ui/react/menu', () => {
  const wrap =
    (Tag: React.ElementType) =>
    ({ children, ...props }: Record<string, unknown>) => {
      return <Tag {...props}>{children as React.ReactNode}</Tag>
    }

  return {
    Menu: {
      Root: wrap('div'),
      Portal: wrap('div'),
      Trigger: wrap('button'),
      Positioner: wrap('div'),
      Popup: wrap('div'),
      Group: wrap('div'),
      Item: wrap('button'),
      SubmenuRoot: wrap('div'),
      SubmenuTrigger: wrap('button'),
      CheckboxItem: wrap('button'),
      CheckboxItemIndicator: wrap('span'),
      RadioGroup: wrap('div'),
      RadioItem: wrap('button'),
      RadioItemIndicator: wrap('span'),
      Separator: wrap('hr'),
    },
  }
})

describe('DropdownMenu', () => {
  it('renders composed dropdown menu parts', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Label</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Item</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked>Checkbox</DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value='default'>Radio</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sub Trigger</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>Sub Content</DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
    expect(screen.getByText('Label')).toHaveAttribute('data-slot', 'dropdown-menu-label')
    expect(screen.getByRole('button', { name: 'Item' })).toHaveAttribute(
      'data-slot',
      'dropdown-menu-item',
    )
    expect(screen.getByText('⌘K')).toHaveAttribute('data-slot', 'dropdown-menu-shortcut')
    expect(screen.getByText('Sub Content')).toBeInTheDocument()
  })
})
