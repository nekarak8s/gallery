import type { Meta, StoryObj } from '@storybook/react'
import Button3D from './Button3D'
import './Button3D.stories.scss'

const meta = {
  title: 'UI/Button3D',
  component: Button3D,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button3D>

export default meta
type Story = StoryObj<typeof meta>

export const White: Story = {
  args: {
    color: 'white',
    ariaLabel: '3D button',
    children: <p className="story-button-3d">3D Button</p>,
  },
}

export const Blue: Story = {
  args: {
    color: 'blue',
    ariaLabel: '3D button',
    children: <p className="story-button-3d">3D Button</p>,
  },
}

export const Black: Story = {
  args: {
    color: 'black',
    ariaLabel: '3D button',
    children: <p className="story-button-3d">3D Button</p>,
  },
}
