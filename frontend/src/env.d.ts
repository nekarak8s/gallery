// css
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

// video
declare module '*.webm' {
  const src: string
  export default src
}

declare module '*.mp4' {
  const src: string
  export default src
}

// audio
declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.aac' {
  const src: string
  export default src
}

// svg
declare module '*.svg' {
  const src: string
  export default src
}

// responsive-laoder
interface ResponsiveImageOutput {
  src: string
  srcSet: string
  placeholder: string | undefined
  images: { path: string; width: number; height: number }[]
  width: number
  height: number
  toString: () => string
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*format=webp' {
  const src: ResponsiveImageOutput
  export default src
}

declare module '*format=png' {
  const src: ResponsiveImageOutput
  export default src
}

declare module '*format=jpg' {
  const src: ResponsiveImageOutput
  export default src
}

declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.gltf' {
  const src: string
  export default src
}
