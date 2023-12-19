import type { Meta, StoryObj } from '@storybook/react'
import Select from './Select'

const meta = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'value',
    children: (
      <>
        <option selected value="">
          === Select option ===
        </option>
        <option value="1">Option1</option>
        <option value="2">Option2</option>
        <option value="3">Option3</option>
      </>
    ),
  },
}
