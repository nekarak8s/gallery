import type { Meta, StoryObj } from '@storybook/react'
import Textarea from './Textarea'

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Label',
    name: 'value',
    initialValue: '',
  },
}
