export interface IBaseOptions {
  source: string,
  out: string,
  minify: boolean,
  clean: boolean
}

export interface IScript {
  path: string,
  content: string
}
