import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Music from './Music'
import bgm from '@/assets/audio/MapleStory-Lith-Harbor.mp3'

export default {
  component: Music,
  title: 'Music',
} as ComponentMeta<typeof Music>

const Template: ComponentStory<typeof Music> = (args) => <Music {...args} />

export const Default = Template.bind({})
Default.args = {
  src: bgm,
  title: 'MapleStory - Lith Harbor',
}
