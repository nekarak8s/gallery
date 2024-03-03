import BowIcon from '@/assets/svgs/bow.svg'
import JumpIcon from '@/assets/svgs/jump.svg'
import useMobile from '@/hooks/useMobile'
import './ControlNotice.scss'

const ControlNotice = () => {
  const isMobile = useMobile()
  return (
    <div className="control-notice">
      {isMobile ? (
        <ul>
          <li>
            <div className="control-notice__controller">
              <div></div>
            </div>
            <p>컨트롤러로 이동</p>
          </li>
          <li>
            <div className="control-notice__button">
              <JumpIcon />
            </div>
            <p>버튼으로 점프</p>
          </li>
          <li>
            <div className="control-notice__button">
              <BowIcon />
            </div>
            <p>버튼으로 앨범 조준</p>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <p>
              <kbd>&uarr;</kbd>&nbsp;
              <kbd>&darr;</kbd> 키로 앞뒤 이동
            </p>
          </li>
          <li>
            <p>
              <kbd>&larr;</kbd>&nbsp;
              <kbd>&rarr;</kbd> 키로 시선 회전
            </p>
          </li>
          <li>
            <p>
              <kbd>Ctrl</kbd>&nbsp; 키로 앨범 조준
            </p>
          </li>
          <li>
            <p>
              <kbd>Alt</kbd>&nbsp;/&nbsp;<kbd>Opt</kbd>&nbsp; 키로 점프
            </p>
          </li>
        </ul>
      )}
    </div>
  )
}

export default ControlNotice
