import { PropsWithChildren } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Button from './Button'

const List = ({ children }: PropsWithChildren) => {
  return <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{children}</div>
}

const meta = {
  title: 'UI/Button',
  component: List,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <Button text="Button" />,
  },
}

export const Color: Story = {
  args: {
    children: (
      <>
        <Button text="Black" />,
        <Button text="Blue" color="blue" />,
        <Button text="Red" color="red" />,
      </>
    ),
  },
}

export const Size: Story = {
  args: {
    children: (
      <>
        <Button text="Large" size="lg" />,
        <Button text="Medium" size="md" />,
        <Button text="Small" size="sm" />,
      </>
    ),
  },
}

export const Direction: Story = {
  args: {
    children: (
      <>
        <Button text="Left" direction="left" />,
        <Button text="Right" direction="right" />,
        <Button text="Top" direction="top" />,
        <Button text="Bottom" direction="bottom" />,
        <Button text="Center" direction="center" />,
      </>
    ),
  },
}
