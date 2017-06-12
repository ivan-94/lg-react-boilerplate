// @flow
import { createAction } from 'utils/common'
import { INCREMENT, DECREMENT } from './constants'

export const increment = createAction(INCREMENT)
export const decrement = createAction(DECREMENT)
