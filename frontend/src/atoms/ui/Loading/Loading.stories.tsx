import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Loading from './Loading'

export default {
  component: Loading,
  title: 'Loading',
} as ComponentMeta<typeof Loading>

const Template: ComponentStory<typeof Loading> = () => <Loading />

export const Default = Template.bind({})
