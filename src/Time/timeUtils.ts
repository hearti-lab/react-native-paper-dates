export type PossibleInputTypes = 'keyboard' | 'picker'
export type InputTypeMap = {
  [inputType: string]: PossibleInputTypes
}
export const inputTypes: InputTypeMap = {
  keyboard: 'keyboard',
  picker: 'picker',
}

export type PossibleClockTypes = 'hours' | 'minutes'
export type ClockTypeMap = {
  [clockType: string]: PossibleClockTypes
}
export const clockTypes: ClockTypeMap = {
  minutes: 'minutes',
  hours: 'hours',
}

// Code inspiration: https://github.com/ShaneGH/analogue-time-picker/blob/master/src/utils/angle.ts

const outerHeight = 34
const _30 = Math.PI / 6
const _12 = Math.PI / 30
const _360 = Math.PI * 2
const _90 = Math.PI / 2

/** Snap an angle to a given step. E.g. if angle = 22° and step = 10°, round down to 20° */
export function snap(angle: number, step: number) {
  let a = angle
  while (a < 0) a += _360
  let diff = a % step

  if (diff <= step / 2) {
    return angle - diff
  }

  return angle - diff + step
}

/** With a 24 hour clock box (width/height) and a mouse position (left/top),
 * determine whether the use is pointing at an AM hour or a PM hour */
export function isPM(left: number, top: number, size: number): boolean {
  const w = size / 2
  const x = w - left
  const y = size / 2 - top

  const distance = Math.sqrt(x * x + y * y)
  const maxPm = w - outerHeight

  return !(distance > maxPm)
}

// Calculate the minute from the hand angle
export function getMinutes(handAngle: number) {
  handAngle = snap(handAngle, _12)

  let minute = parseInt((((handAngle - _90) % _360) / _12).toFixed())
  while (minute < 0) minute += 60
  while (minute >= 60) minute -= 60
  // TODO: maybe something simpler?
  // Like Math.min(minute, 0) is this needed??
  // if (minute < 0) minute += 12
  // if (minute >= 12) minute -= 12
  // if (minute < 0) {
  //   return Math.max(minute,60)
  // }
  return minute
}

// Calculate the hour from the hand angle
export function getHours(handAngle: number) {
  handAngle = snap(handAngle, _30)

  // TODO: parseInt?
  let hour = parseInt((((handAngle - _90) % _360) / _30).toFixed())
  if (hour < 0) hour += 12
  if (hour >= 12) hour -= 12

  // TODO:
  // if (!hour) {
  //   if (amPm === AmPm.am) hour = 12
  // } else {
  //   if (amPm !== AmPm.am) hour += 12
  // }

  return hour
}

/** Get the angle of the left/top co-ordinate from the center of the width.height box */
export function getAngle(left: number, top: number, size: number) {
  const x = size / 2 - left
  const y = size / 2 - top

  // tan O = y / x
  let angle = x ? Math.atan(y / x) : y < 0 ? -_90 : _90
  if (x < 0) {
    // reflect along vertical axis
    angle = -angle + 2 * (_90 + angle)
  }

  return angle
}
