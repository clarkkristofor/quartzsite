import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
// import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

// {i18n(cfg.locale).components.footer.createdWith}{" "}  © cfg never read
export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
           Powered by the yellow sun of <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a>. Protected by <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" class="external-link">CC BY 4.0</a> 2020-{year}. super clark: <a href="https://www.youtube.com/watch?v=Emu1pgPPCy8" target="_blank" class="external-link">the real punk rock</a>.
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
