import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Profile from './Profile'
import { userData } from '../../data'

export default {
  title: 'Profile',
  component: Profile,
  parameters: {
    mockData: [
      {
        url: '/member',
        method: 'GET',
        status: 200,
        response: {
          data: userData,
        },
      },
    ],
  },
} as ComponentMeta<typeof Profile>

const Template: ComponentStory<typeof Profile> = () => <Profile />

export const Default = Template.bind({})
