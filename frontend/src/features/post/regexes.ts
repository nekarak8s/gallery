export const postId: RegexCondition = {
  regex: /^[1-9]\d*$/,
  condition: '공간 식별값(숫자)이 올바르지 않습니다',
}

export const order: RegexCondition = {
  regex: /^[1-9]|10$/,
  condition: '게시물의 순서(1~10)가 올바르지 않습니다',
}

export const title: RegexCondition = {
  regex: /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]{0,15}$/,
  condition: '한/영/숫자 조합 15자 이내로 입력해주세요',
}

export const content: RegexCondition = {
  regex: /[\s\S]{0,150}/,
  condition: '공백 포함 1~150자 이내로 입력해주세요',
}

export const musicId: RegexCondition = {
  regex: /^[1-9]\d*$/,
  condition: '음악 식별값(숫자)이 올바르지 않습니다',
}

export const isActive: RegexCondition = {
  regex: /^(false|true)$/,
  condition: '게시물 활성화 여부값 올바르지 않습니다',
}
