import './ControlNotice.scss'

const ControlNotice = () => {
  return (
    <div className="control-notice">
      <ul>
        <li>
          <kbd>&uarr;</kbd>&nbsp;
          <kbd>&darr;</kbd> 키로 앞뒤로 이동하세요
        </li>
        <li>
          <kbd>&larr;</kbd>&nbsp;
          <kbd>&rarr;</kbd> 키로 시선을 회전하세요
        </li>
        <li>
          <kbd>스페이스</kbd>&nbsp; 키로 앨범을 조준하세요
        </li>
      </ul>
    </div>
  )
}

export default ControlNotice
