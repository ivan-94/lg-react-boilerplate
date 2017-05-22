/**
 * 默认样式主题
 */

const grayScale = {
  white: '#fefefe',
  lightGray: '#e6e6e6',
  mediumGray: '#cacaca',
  darkGray: '#808080',
  black: '#0a0a0a',
}

const named = {
  primary: '#4D88D8',
  secondary: '#1A2E41',
  success: '#3adb76',
  warning: '#ffae00',
  alert: '#cc4b37',
  light: '#fefefe',
  dark: '#545454',
}

const size = {
  xsmall: '.7em',
  small: '.8em',
  default: '1em',
  large: '1.5em',
}

export default {
  ...grayScale,
  ...named,
  size,
}
