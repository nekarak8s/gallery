import { PropsWithChildren } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import musicSrc from '@/assets/audios/MapleStory-Lith-Harbor.mp3'
import A from '@/atoms/ui/A'
import Button from '@/atoms/ui/Button'
import Button3D from '@/atoms/ui/Button3D'
import Loading from '@/atoms/ui/Loading'
import Music from '@/atoms/ui/Music'
import ScrollDown from '@/atoms/ui/ScrollDown'
import Table from '@/atoms/ui/Table/Table'
import Toast from '@/atoms/ui/Toast'

const Column = ({ children }: PropsWithChildren) => {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>{children}</div>
}
const Row = ({ children }: PropsWithChildren) => {
  return <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{children}</div>
}

const meta = {
  title: 'Overview/UI',
  component: Column,
} satisfies Meta<typeof Column>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <Row>
          <A href="https://github.com/Byongho96" title="Byongho's github">
            Link to Byongho&apos;s github
          </A>
        </Row>
        <Row>
          <Toast type="success" message="Success! :)" destroy={() => {}} duration={3000} />
          <Toast type="error" message="Error :(" destroy={() => {}} duration={3000} />
          <Toast type="info" message="Notice" destroy={() => {}} duration={3000} />
        </Row>
        <Row>
          <Table caption="Example">
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
          </Table>
        </Row>
        <Row>
          <Button text="Button" />
          <Button text="Button" direction="top" />
          <Button text="Button" direction="right" />
          <Button text="Button" direction="bottom" />
          <Button text="Button" direction="center" />
        </Row>
        <Row>
          <Button text="Button" />
          <Button text="Button" color="blue" />
          <Button text="Button" color="red" />
        </Row>
        <Row>
          <Button text="Button" size="lg" />
          <Button text="Button" size="md" />
          <Button text="Button" size="sm" />
        </Row>
        <Row>
          <Button3D color="white" ariaLabel="3D Button">
            <p
              style={{
                padding: '1rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              3D Button
            </p>
          </Button3D>
          <Button3D color="blue" ariaLabel="3D Button">
            <p
              style={{
                padding: '1rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
              }}
              className="story-button-3d"
            >
              3D Button
            </p>
          </Button3D>
          <Button3D color="black" ariaLabel="3D Button">
            <p
              style={{
                padding: '1rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
              }}
              className="story-button-3d"
            >
              3D Button
            </p>
          </Button3D>
        </Row>
        <Row>
          <Loading />
        </Row>
        <Row>
          <Music src={musicSrc} title="Maple Story - Lith Harbor (ver. Piano)" color="white" />
          <Music src={musicSrc} title="Maple Story - Lith Harbor (ver. Piano)" color="black" />
        </Row>
        <Row>
          <ScrollDown />
        </Row>
      </>
    ),
  },
}
