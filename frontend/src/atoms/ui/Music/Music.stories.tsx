import type { Meta, StoryObj } from '@storybook/react'
import Music from './Music'
import musicSrc from '@/assets/audios/MapleStory-Lith-Harbor.mp3'

const meta = {
  title: 'UI/Music',
  component: Music,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Music>

export default meta
type Story = StoryObj<typeof meta>

export const Black: Story = {
  args: {
    sources: [
      {
        src: musicSrc,
        type: 'audio/mpeg',
      },
    ],
    title: 'Maple Story - Lith Harbor (ver. Piano)',
    color: 'black',
  },
}
export const White: Story = {
  args: {
    sources: [
      {
        src: musicSrc,
        type: 'audio/mpeg',
      },
    ],
    title: 'Maple Story - Lith Harbor (ver. Piano)',
    color: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
