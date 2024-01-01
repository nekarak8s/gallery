import type { Meta, StoryObj } from '@storybook/react'
import ScrollDown from './ScrollDown'

const meta = {
  title: 'UI/ScrollDown',
  component: ScrollDown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollDown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
