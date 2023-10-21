import * as regexes from './regexes'

export function validateProfileForm(
  formData: FormData
): RegexResult<ProfileFormData> {
  // validate nikcname
  const nickname = formData.get('nickname') as string
  if (!regexes.nickname.reg.test(nickname)) {
    return { result: false, reason: regexes.nickname.con }
  }

  return { result: true, data: { nickname } }
}
