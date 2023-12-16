import { useState } from 'react'
import Modal from '../Modal'
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
          더 갤러리: <del>인스타그램 3D 버전</del> 쿠버네티스 배포용 토이프로젝트
        </p>
        <address>
          <ul>
            <li>
              이병호.&nbsp;&nbsp;
              <a
                href="https://github.com/Byongho96"
                title="이병호 깃헙"
                target="_blank"
                className="footer__icon-text"
                data-cursor-scale={CURSOR_SCALE}
                rel="noreferrer"
              >
                <GithubIcon /> Byongho96
              </a>
              &nbsp;&nbsp;
              <a
                href="mailto:unlike96@gmail.com"
                title="이병호 이메일"
                target="_blank"
                className="footer__icon-text"
                data-cursor-scale={CURSOR_SCALE}
                rel="noreferrer"
              >
                <GmailIcon /> unlike96@gmail.com
              </a>
            </li>
            <li>
              이찬희.&nbsp;&nbsp;
              <a
                href="https://github.com/chancehee"
                title="이찬희 깃헙"
                target="_blank"
                className="footer__icon-text"
                data-cursor-scale={CURSOR_SCALE}
                rel="noreferrer"
              >
                <GithubIcon />
                chancehee
              </a>
              &nbsp;&nbsp;
              <a
                href="mailto:dojsfffff@gmail.com"
                title="이찬희 이메일"
                target="_blank"
                className="footer__icon-text"
                data-cursor-scale={CURSOR_SCALE}
                rel="noreferrer"
              >
                <GmailIcon /> dojsfffff@gmail.com
              </a>
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
          <table>
            <thead>
              <tr>
                <th></th>
                <th>저작물, 저작자</th>
                <th>라이선스</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>폰트</td>
                <td>
                  <a
                    href="https://www.youtube.com/watch?v=tFcJsB-pekY"
                    title="프리텐다드 글꼴"
                    target="_blank"
                    rel="noreferrer"
                  >
                    orioncactus, Pretendard
                  </a>
                </td>
                <td>
                  <a
                    href="https://openfontlicense.org/"
                    title="SIL 라이선스"
                    target="_blank"
                    rel="noreferrer"
                  >
                    SIL 오픈 폰트
                  </a>
                </td>
              </tr>
              <tr>
                <td>홈 BGM</td>
                <td>
                  <a
                    href="https://www.youtube.com/watch?v=tFcJsB-pekY"
                    title="프리텐다드 글꼴"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Above the Treetops, Pair Piano
                  </a>
                </td>
                <td> </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  )
}

export default Footer
