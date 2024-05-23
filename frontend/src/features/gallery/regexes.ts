export const name: RegexCondition = {
  regex: /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]{1,15}$/,
  condition: '한/영/숫자 조합 1~15자로 입력해주세요',
}

export const content: RegexCondition = {
  regex: /^[\s\S]{1,500}$/,
  condition: '공백 포함 500자로 입력해주세요',
}

export const placeId: RegexCondition = {
  regex: /^[1-9]\d*$/,
  condition: '공간 식별값(숫자)이 올바르지 않습니다',
}
