export const content: RegexCondition = {
  regex: /[\s\S]{1,100}/,
  condition: '공백 포함 100자로 입력해주세요',
}

export const postId: RegexCondition = {
  regex: /^[1-9]\d*$/,
  condition: '게시물 식별자(숫자)가 올바르지 않습니다',
}
