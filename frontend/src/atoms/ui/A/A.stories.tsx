import type { Meta, StoryObj } from '@storybook/react'
import A from './A'

const meta = {
  title: 'UI/Link',
  component: A,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof A>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: 'https://github.com/Byongho96',
    title: "Byongho's github",
    children: <p>Link to Byongho&apos;s github</p>,
  },
}
