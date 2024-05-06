import { useTranslation } from 'react-i18next'
import { TControlType } from '../../hooks/useControlsStrategy'
import GameSvg from '@/assets/svgs/game.svg'
import PointerSvg from '@/assets/svgs/pointer.svg'
import Button3D from '@/atoms/ui/Button3D'
import './ControlSelection.scss'

type ControlSelectionProps = {
  onSelect: (type: TControlType) => void
}

function ControlSelection({ onSelect }: ControlSelectionProps) {
  const { t } = useTranslation()

  return (
    <div className="control-selection">
      <h2 className="control-selection__title">{t('controller.chooseType')}</h2>
      <ul className="control-selection__list">
        <li>
          <Button3D onClick={() => onSelect('mouse')} ariaLabel="마우스로 컨트롤">
            <div className="control-selection__button">
              <PointerSvg />
              <span>{t('controller.mouse')}</span>
            </div>
          </Button3D>
        </li>
        <li>
          <Button3D onClick={() => onSelect('keypad')} ariaLabel="키패드로 컨트롤">
            <div className="control-selection__button">
              <GameSvg />
              <span>{t('controller.keypad')}</span>
            </div>
          </Button3D>
        </li>
      </ul>
    </div>
  )
}

export default ControlSelection
