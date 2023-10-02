import React from 'react'
import { withRouter } from 'storybook-addon-react-router-v6'
import Navbar from './Navbar'

export default {
  component: Navbar,
  title: 'Navbar',
  decorators: [withRouter],
}

const Template = () => <Navbar />

export const Default = Template.bind({})
