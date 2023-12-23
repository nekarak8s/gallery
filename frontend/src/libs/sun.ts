// Max elevation
// https://threejs.org/examples/webgl_shaders_ocean.html
const MAX_ELEVATION = 20

// Seoul avearage sunrise & sunset
// https://borisu-gim.tistory.com/15966610
const SUNRISE_SUNSET = [
  { sunrise: 0, sunset: 0 },
  { sunrise: 7 + 45 / 60, sunset: 17 + 38 / 60 },
  { sunrise: 7 + 21 / 60, sunset: 18 + 11 / 60 },
  { sunrise: 6 + 43 / 60, sunset: 18 + 39 / 60 },
  { sunrise: 5 + 57 / 60, sunset: 19 + 7 / 60 },
  { sunrise: 5 + 23 / 60, sunset: 19 + 34 / 60 },
  { sunrise: 5 + 10 / 60, sunset: 19 + 55 / 60 },
  { sunrise: 5 + 23 / 60, sunset: 19 + 53 / 60 },
  { sunrise: 5 + 48 / 60, sunset: 19 + 24 / 60 },
  { sunrise: 6 + 14 / 60, sunset: 18 + 40 / 60 },
  { sunrise: 6 + 40 / 60, sunset: 17 + 55 / 60 },
  { sunrise: 7 + 12 / 60, sunset: 17 + 21 / 60 },
  { sunrise: 7 + 39 / 60, sunset: 17 + 17 / 60 },
]

/**
 * Simplified function for getting rough sun positoin
 * @param date Datetime to know the sun position
 * @returns
 */
export function getSunPosition(date: Date): { azimuth: number; elevation: number } {
  const month = date.getMonth()
  const time = date.getHours() + date.getMinutes() / 60

  // Get sunrise, sunset
  const { sunrise, sunset } = SUNRISE_SUNSET[month]
  const noon = (sunrise + sunset) / 2

  // Calculate elevation
  const elevation =
    MAX_ELEVATION - (MAX_ELEVATION * Math.abs(noon - time)) / ((sunset - sunrise) / 2)

  // Calculate azimuth
  const azimuth = (180 * (time - sunrise)) / (sunset - sunrise) + 10

  return { azimuth, elevation }
}

/**
 * Simplified function for getting rough sun intensity
 * @param date Datetime to know the sun intensity
 * @returns
 */
export function getSunIntensity(date: Date): number {
  const { elevation } = getSunPosition(date)

  // Sun on the sky
  if (elevation > 0) {
    return (elevation / MAX_ELEVATION) * 0.5 + 0.5
  }

  // Sunset but light scattering
  if (elevation > -2.5) {
    return ((2.5 + elevation) / 2.5) * 0.4 + 0.1
  }

  // Darkness
  return 0.1
}

/**
 * Simplified function for getting rough sun color
 * @param date Datetime to know the sun color
 * @returns
 */
export function getSunColor(date: Date) {
  const { elevation } = getSunPosition(date)

  const factor = ((MAX_ELEVATION - elevation) / MAX_ELEVATION) ** 3
  const red = 255
  const green = Math.floor(255 - 13 * factor)
  const blue = Math.floor(255 - 129 * factor)

  // Return the color in RGB format
  return `rgb(${red}, ${green}, ${blue})`
  // return `rgb(255, 255, 255)`
}
