import { Fragment } from 'react'

/** Renders copy lines joined by <br>; `breakClass` limits the breaks to some breakpoints. */
export default function Lines({ lines, breakClass }: { lines: string[]; breakClass?: string }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br className={breakClass} />}
          {line}
        </Fragment>
      ))}
    </>
  )
}
