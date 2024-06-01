import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import A from '../A'
import Modal from '../Modal'
import Table from '../Table/Table'
import FileIcon from '@/assets/svgs/file.svg'
import GithubIcon from '@/assets/svgs/github.svg'
import GmailIcon from '@/assets/svgs/gmail.svg'
import { CURSOR_SCALE } from '@/constants'
import './Footer.scss'

const Footer = () => {
  const { t } = useTranslation()
  const [isCopyOpen, setIsCopyOpen] = useState(false) // is copyright modal open

  return (
    <>
      <footer className="footer">
        <p>{t('footer.summarize')}</p>
        <address>
          <ul>
            <li>
              {t('footer.byongho')}.&nbsp;&nbsp;
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
              {t('footer.chanhee')}.&nbsp;&nbsp;
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
        <button className="footer__icon-text" onClick={() => setIsCopyOpen(true)} data-cursor-scale={CURSOR_SCALE}>
          <FileIcon /> {t('footer.externalCopyright')}
        </button>
        <p> {t('footer.copyright')}</p>
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
                <th scope="column">{t('copyright.column1')}</th>
                <th scope="column">{t('copyright.column2')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{t('copyright.row1')}</th>
                <td>
                  <A href="https://cactus.tistory.com/306" title="프리텐다드 글꼴" target="_blank">
                    Pretendard, orioncactus
                  </A>
                </td>
                <td>
                  <A href="https://openfontlicense.org/" title="SIL 라이선스" target="_blank">
                    SIL Open Font
                  </A>
                </td>
              </tr>
              <tr>
                <th scope="row">{t('copyright.row2')}</th>
                <td>
                  <A href="https://github.com/yangheeryu/Gowun-Dodum" title="고운돋움 글꼴" target="_blank">
                    Gowun-Dodum, yangheeryu
                  </A>
                </td>
                <td>
                  <A href="https://openfontlicense.org/" title="SIL 라이선스" target="_blank">
                    SIL Open Font
                  </A>
                </td>
              </tr>
              <tr>
                <th scope="row">{t('copyright.row3')}</th>
                <td>
                  <A href="https://www.youtube.com/watch?v=tFcJsB-pekY" title="Youtube 메이플스토리 리스항구 피아노 커버" target="_blank">
                    Above the Treetops, Pair Piano
                  </A>
                </td>
                <td> </td>
              </tr>
              <tr>
                <th scope="row">{t('copyright.row4')}</th>
                <td>
                  <A href="https://www.youtube.com/watch?v=YhQnBDHCMk4" title="Youtube 메이플스토리 수련의 숲 피아노 커버" target="_blank">
                    Raindrop Flower, Pair Piano
                  </A>
                </td>
                <td> </td>
              </tr>
              <tr>
                <th scope="row">{t('copyright.row5')}</th>
                <td>
                  <A href="https://www.youtube.com/watch?v=JOT0auAGc_U" title="Youtube 메이플스토리 판테온 피아노 커버" target="_blank">
                    Pantheon, Pair Piano
                  </A>
                </td>
                <td> </td>
              </tr>
              <tr>
                <th scope="row">{t('copyright.row6')}</th>
                <td>
                  <A href="https://soundcloud.com/user-356546060/colorful-flowers" title="Soundcloud,Tokyo Music Walker" target="_blank">
                    Colorful Flowers, Tokyo Music Walker
                  </A>
                </td>
                <td>CC BY 3.0 DEED</td>
              </tr>
              <tr>
                <th scope="row">{t('copyright.row7')}</th>
                <td>
                  <A
                    href="https://sketchfab.com/3d-models/tanabata-evening-kyoto-inspired-city-scene-04dc9402b74d43ef86c4795311c0e4bb"
                    title="Sketchfab, Mathias Tossens"
                    target="_blank"
                  >
                    Tanabata evening, Mathias Tossens
                  </A>
                </td>
                <td>CC Atribution</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Modal>
    </>
  )
}

export default Footer
