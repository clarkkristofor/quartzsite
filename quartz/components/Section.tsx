import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  className?: string
  title?: string
  children?: (QuartzComponent | undefined)[]
}

const Section: QuartzComponent = (props: QuartzComponentProps & { options?: Options }) => {
  const { options, fileData, displayClass } = props
  const slug = fileData.slug ?? ""

  // If this is the home grid but we aren't on the root page, hide it
  if (options?.className === "home-only-grid" && slug !== "index" && slug !== "") {
    return null
  }

  return (
    <section className={`${options?.className ?? ""} ${displayClass ?? ""}`}>
      {options?.title && <h2>{options?.title}</h2>}
      {options?.children?.map((Child, index) => Child ? <Child key={index} {...props} /> : null)}
    </section>
  )
}

export default ((opts?: Options) => {
  const Component = (props: QuartzComponentProps) => Section({ ...props, options: opts })
  return Component
}) satisfies QuartzComponentConstructor