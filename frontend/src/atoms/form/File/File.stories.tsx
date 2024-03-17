import type { Meta, StoryObj } from '@storybook/react'
import File from './File'

const meta = {
  title: 'Form/File',
  component: File,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof File>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'file',
    accept: '*',
    uploadBtnText: 'Upload',
    resetBtnText: 'Reset',
  },
}
