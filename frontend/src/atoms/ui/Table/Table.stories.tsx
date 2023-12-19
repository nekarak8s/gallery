import type { Meta, StoryObj } from '@storybook/react'
import Table from './Table'

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    caption: 'Storybook example table',
    children: (
      <>
        <thead>
          <tr>
            <th></th>
            <th scope="row">Column1</th>
            <th scope="row">Column2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Row1</th>
            <td>Content</td>
            <td>Content</td>
          </tr>
          <tr>
            <th scope="row">Row2</th>
            <td>Content</td>
            <td>Content</td>
          </tr>
          <tr>
            <th scope="row">Row3</th>
            <td>Content</td>
            <td>Content</td>
          </tr>
        </tbody>
      </>
    ),
  },
}
