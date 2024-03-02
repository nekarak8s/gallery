import * as regexes from './regexes'
import { ProfileFormData } from './types'

export function validateProfileForm(formData: FormData): RegexResult<ProfileFormData> {
  // validate nikcname
  const nickname = formData.get('nickname') as string
  if (!regexes.nickname.regex.test(nickname)) {
    return { result: false, reason: regexes.nickname.condition }
  }

  return { result: true, data: { nickname } }
}
