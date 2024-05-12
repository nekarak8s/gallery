import type { Meta, StoryObj } from '@storybook/react'
import PortfoiloDetail from './PortfolioDetail'
import { portfolioItemData } from '../../data'

const meta = {
  title: 'Components/PortfoiloDetail',
  component: PortfoiloDetail,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PortfoiloDetail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    post: portfolioItemData,
  },
}
