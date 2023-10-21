export const name: RegexCondition = {
  reg: /^[A-Za-z0-9가-힣\s]{1,15}$/,
  con: '한/영/숫자 조합 1~15자로 입력해주세요',
}

export const content: RegexCondition = {
  reg: /[\s\S]{1,150}/,
  con: '공백 포함 150자로 입력해주세요',
}

export const placeId: RegexCondition = {
  reg: /^[1-9]\d*$/,
  con: '공간값(숫자)이 올바르지 않습니다',
}
