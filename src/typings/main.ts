export type Pos = { x: number; y: number }
export type Cycle = Pos & { r: number; }
export type PosOffset = { dx: number; dy: number }
export type Offset = Pos
export type CanvasCtxOptions = { [key: string]: any }

export type RemoveReadonly<T, K extends keyof T> = Omit<T, K> & {
  - readonly [Prop in K]: T[Prop]
}