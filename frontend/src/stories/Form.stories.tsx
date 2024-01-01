import { PropsWithChildren } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Checkbox from '@/atoms/form/Checkbox'
import File from '@/atoms/form/File'
import Form from '@/atoms/form/Form'
import Radio from '@/atoms/form/Radio'
import Select from '@/atoms/form/Select'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'

const Column = ({ children }: PropsWithChildren) => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: 'min(400px, 90%)' }}
    >
      {children}
    </div>
  )
}
const Row = ({ children }: PropsWithChildren) => {
  return <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{children}</div>
}

const meta = {
  title: 'Overview/Form',
  component: Form,
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <Column>
        <Text label="Text" name="text" initialValue="" />
        <Textarea label="Textarea" name="textarea" initialValue="" />
        <Select name="select">
          <option selected value="">
            === Select option ===
          </option>
          <option value="1">Option1</option>
          <option value="2">Option2</option>
          <option value="3">Option3</option>
        </Select>
        <Row>
          <Checkbox name="checkbox" label="Checkbox1" />
          <Checkbox name="checkbox" label="Checkbox2" />
          <Checkbox name="checkbox" label="Checkbox3" />
        </Row>
        <Row>
          <Radio name="radio" label="radio1" value="1" />
          <Radio name="radio" label="radio2" value="2" />
          <Radio name="radio" label="radio3" value="3" />
        </Row>
        <File name="file" accept="*" uploadBtnText="Upload" resetBtnText="Reset" />
      </Column>
    ),
  },
}
