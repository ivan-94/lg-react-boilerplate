// @flow
/*
 * reducer 的命名空间, 这个是根state的挂载点，也是Action Type的命名前缀
 * 命名前缀有利于后续redux性能优化
 */
export const nameSpace = 'home'

export const INCREMENT = `${nameSpace}@@INCREMENT`
export const DECREMENT = `${nameSpace}@@DECREMENT`
