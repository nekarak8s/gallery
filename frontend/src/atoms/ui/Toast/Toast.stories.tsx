import type { Meta, StoryObj } from '@storybook/react'
import Toast from './Toast'

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Success! :)',
    destroy: () => {},
    duration: 3000,
  },
}

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Fail :(',
    destroy: () => {},
    duration: 3000,
  },
}

export const Info: Story = {
  args: {
    type: 'info',
    message: 'Notice: notice',
    destroy: () => {},
    duration: 3000,
  },
}
