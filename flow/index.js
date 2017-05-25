import { List, Map } from 'immutable'
// eslint-disable-next-line no-undef
declare type Redux$Action = {
  type: string,
  payload: any,
}

declare type MessageDescriptor = {
  id: string,
  defaultMessage?: string,
  description?: string | Object,
}

// eslint-disable-next-line no-undef
declare type IntlProps = {
  formatMessage (desc: MessageDescriptor, value?: Object): string,
}

// eslint-disable-next-line no-undef
declare type ReactComponent = Function | React$Component<*, *, *> | React$PureComponent<*, *, *>

// svg-sprite-loader(2.0)
// eslint-disable-next-line no-undef
declare type SpriteSymbol = {
  id: string,
  viewBox: string,
  content: string,
}
