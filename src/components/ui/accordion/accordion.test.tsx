import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion'

describe('Accordion', () => {
  it('renders an opened panel from defaultValue and toggles on click', async () => {
    const user = userEvent.setup()

    render(
      <Accordion defaultValue={['filters']}>
        <AccordionItem value='filters'>
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent>Panel content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    const panel = screen.getByText('Panel content').closest(
      '[data-slot="accordion-content"]',
    ) as HTMLElement | null

    if (panel == null) {
      throw new Error('Accordion panel not found')
    }

    expect(panel).toBeVisible()
    expect(screen.getByText('Panel content')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /filters/i }))
    expect(panel).toHaveAttribute('hidden')

    await user.click(screen.getByRole('button', { name: /filters/i }))
    expect(panel).not.toHaveAttribute('hidden')
  })
})
