import type { Meta, StoryObj } from '@storybook/react'
import Loading from './Loading'

const meta = {
  title: 'UI/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {},
}
