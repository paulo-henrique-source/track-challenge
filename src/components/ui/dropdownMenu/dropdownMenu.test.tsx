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
  const wrap = (Tag: React.ElementType, displayName: string) => {
    const Wrapped = ({ children, ...props }: Record<string, unknown>) => {
      return <Tag {...props}>{children as React.ReactNode}</Tag>
    }

    Wrapped.displayName = displayName
    return Wrapped
  }

  return {
    Menu: {
      Root: wrap('div', 'MenuRootMock'),
      Portal: wrap('div', 'MenuPortalMock'),
      Trigger: wrap('button', 'MenuTriggerMock'),
      Positioner: wrap('div', 'MenuPositionerMock'),
      Popup: wrap('div', 'MenuPopupMock'),
      Group: wrap('div', 'MenuGroupMock'),
      Item: wrap('button', 'MenuItemMock'),
      SubmenuRoot: wrap('div', 'MenuSubmenuRootMock'),
      SubmenuTrigger: wrap('button', 'MenuSubmenuTriggerMock'),
      CheckboxItem: wrap('button', 'MenuCheckboxItemMock'),
      CheckboxItemIndicator: wrap('span', 'MenuCheckboxItemIndicatorMock'),
      RadioGroup: wrap('div', 'MenuRadioGroupMock'),
      RadioItem: wrap('button', 'MenuRadioItemMock'),
      RadioItemIndicator: wrap('span', 'MenuRadioItemIndicatorMock'),
      Separator: wrap('hr', 'MenuSeparatorMock'),
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
