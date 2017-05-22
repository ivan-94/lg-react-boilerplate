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

// eslint-disable-next-line no-undef
declare type ListContainerProps = {
  loading: boolean,
  error: any,
  totalPages: number,
  page: number,
  allList: List<*>,
  list: ?List<*>,
  flattenList: List<*>,
  dispatch: Function,
}

// eslint-disable-next-line no-undef
declare type ListContainerWrappedProps = ListContainerProps & {
  hasMore: boolean,
  onPageChange: (page: number) => void,
  onEndReached: Function,
}

// eslint-disable-next-line no-undef
declare type FormContainerProps = {
  creating: boolean,
  error: any,
  dispatch: Function,
}

// eslint-disable-next-line no-undef
declare type FormContainerWrappedProps = FormContainerProps & {
  schema: Object,
  model: Object,
  onChange: Function,
  onSubmit: Function,
}

// eslint-disable-next-line no-undef
declare type DetailContentProps = {
  loading: boolean,
  error: any,
  content: ?Map<*, *>,
  dispatch: Function,
}

// eslint-disable-next-line no-undef
declare type DetailContentWrappedProps = DetailContentProps & {
  params: Object,
}
