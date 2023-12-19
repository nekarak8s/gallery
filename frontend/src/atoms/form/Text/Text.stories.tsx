import type { Meta, StoryObj } from '@storybook/react'
import Text from './Text'

const meta = {
  title: 'Form/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Label',
    name: 'value',
    initialValue: '',
  },
}
