import { useState } from 'react'
import A from '../A'
import Modal from '../Modal'
import Table from '../Table/Table'
import FileIcon from '@/assets/svgs/file.svg'
import GithubIcon from '@/assets/svgs/github.svg'
import GmailIcon from '@/assets/svgs/gmail.svg'
import { CURSOR_SCALE } from '@/constants'
import './Footer.scss'

const Footer = () => {
  const [isCopyOpen, setIsCopyOpen] = useState(false) // is copyright modal open

  return (
    <>
      <footer className="footer">
        <p>
          더 갤러리: 당신만의 3D <del>인스타그램</del>갤러리
        </p>
        <address>
          <ul>
            <li>
              이병호.&nbsp;&nbsp;
              <A
                href="https://github.com/Byongho96"
                title="이병호 깃헙"
                target="_blank"
                className="footer__icon-text"
                data-cursor-scale={CURSOR_SCALE}
              >
                <GithubIcon /> Byongho96
              </A>
              &nbsp;&nbsp;
              <A
                href="mailto:unlike96@gmail.com"
                title="이병호 이메일"
                target="_blank"
                className="footer__icon-text"
                data-cursor-scale={CURSOR_SCALE}
              >
                <GmailIcon /> unlike96@gmail.com
              </A>
            </li>
            <li>
              이찬희.&nbsp;&nbsp;
              <A
                href="https://github.com/chancehee"
                title="이찬희 깃헙"
                target="_blank"
                className="footer__icon-text"
                data-cursor-scale={CURSOR_SCALE}
              >
                <GithubIcon /> chancehee
              </A>
              &nbsp;&nbsp;
              <A
                href="mailto:dojsfffff@gmail.com"
                title="이찬희 이메일"
                target="_blank"
                className="footer__icon-text"
                data-cursor-scale={CURSOR_SCALE}
              >
                <GmailIcon /> dojsfffff@gmail.com
              </A>
            </li>
          </ul>
        </address>
        <button
          className="footer__icon-text"
          onClick={() => setIsCopyOpen(true)}
          data-cursor-scale={CURSOR_SCALE}
        >
          <FileIcon /> 외부 저작권 표기
        </button>
        <p>Copyright © 2023 이병호 & 이찬희, 외부 저작권 빼고 마음대로 사용가능</p>
      </footer>
      {/* Copyright modal */}
      <Modal
        isOpen={isCopyOpen}
        onClose={() => {
          setIsCopyOpen(false)
        }}
      >
        <div className="footer__license">
          <Table caption={'저작물 링크와 라이선스 정보'}>
            <thead>
              <tr>
                <th></th>
                <th scope="column">저작물, 저작자</th>
                <th scope="column">라이선스</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">폰트</th>
                <td>
                  <A
                    href="https://www.youtube.com/watch?v=tFcJsB-pekY"
                    title="프리텐다드 글꼴"
                    target="_blank"
                  >
                    Pretendard, orioncactus
                  </A>
                </td>
                <td>
                  <A href="https://openfontlicense.org/" title="SIL 라이선스" target="_blank">
                    SIL 오픈 폰트
                  </A>
                </td>
              </tr>
              <tr>
                <th scope="row">홈 BGM</th>
                <td>
                  <A
                    href="https://www.youtube.com/watch?v=tFcJsB-pekY"
                    title="Youtube 메이플스토리 리스항구 피아노 커버"
                    target="_blank"
                  >
                    Above the Treetops, Pair Piano
                  </A>
                </td>
                <td> </td>
              </tr>
              <tr>
                <th scope="row">초원 BGM</th>
                <td>
                  <A
                    href="https://www.youtube.com/watch?v=YhQnBDHCMk4"
                    title="Youtube 메이플스토리 수련의 숲 피아노 커버"
                    target="_blank"
                  >
                    Raindrop Flower, Pair Piano
                  </A>
                </td>
                <td> </td>
              </tr>
              <tr>
                <th scope="row">갤러리 BGM</th>
                <td>
                  <A
                    href="https://www.youtube.com/watch?v=JOT0auAGc_U"
                    title="Youtube 메이플스토리 판테온 피아노 커버"
                    target="_blank"
                  >
                    Pantheon, Pair Piano
                  </A>
                </td>
                <td> </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Modal>
    </>
  )
}

export default Footer
