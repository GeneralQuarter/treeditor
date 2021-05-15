import { SVGProps } from 'react';

export default function HeightTriangle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 75" {...props}>
      <polygon points="50,0 100,75 0,75" fill="transparent" stroke="currentColor" strokeWidth={2} />
    </svg>
  )
}