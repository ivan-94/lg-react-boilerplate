// @flow
import React from 'react'
import styled from 'styled-components'

const Svg = styled.svg`
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: ${props => props.fill || 'currentColor'};
  vertical-align: middle;
`

export default function Icon (props: {
  src: SpriteSymbol,
  fill?: string,
  className?: string,
}) {
  return (<Svg className={props.className} fill={props.fill} viewBox={props.src.viewBox}>
    <use xlinkHref={props.src.id} />
  </Svg>)
}
