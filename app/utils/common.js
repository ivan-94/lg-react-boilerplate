// @flow
import identity from 'lodash/identity'
export function createAction (
  type: string,
  payloadCreator: Function = identity,
  metaCreator?: Function
) {
  const actionCreator = (...args: Array<any>) => {
    const payload = payloadCreator(...args)
    const action = {
      type,
      payload: null,
      error: undefined,
      meta: undefined,
    }

    if (payload instanceof Error) {
      action.error = true
    }

    if (payload != null) {
      action.payload = payload
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args)
    }
    return action
  }

  // $FlowFixMe
  actionCreator.toString = () => type
  return actionCreator
}
