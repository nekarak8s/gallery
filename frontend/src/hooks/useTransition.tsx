// import { useState, useEffect } from 'react'

// function useTransition(ref, isShow) {

//   useEffect(() => {
//     if (ref.current) {
//       const element = ref.current

//       if (isShow) {
//         // 요소를 나타낼 때 애니메이션 클래스 추가
//         element.classList.add('show-animation')
//       } else {
//         // 요소를 사라지게 할 때 애니메이션 클래스 추가
//         element.classList.add('hide-animation')
//       }

//       // 애니메이션 완료 후 클래스 제거 및 상태 업데이트
//       const onAnimationEnd = () => {
//         element.classList.remove('show-animation', 'hide-animation')
//         setIsVisible(isShow)
//       }

//       element.addEventListener('animationend', onAnimationEnd)

//       // 컴포넌트 언마운트 시에 이벤트 리스너 제거
//       return () => {
//         element.removeEventListener('animationend', onAnimationEnd)
//       }
//     }
//   }, [ref, isShow])

//   return isVisible
// }

// export default useTransition
