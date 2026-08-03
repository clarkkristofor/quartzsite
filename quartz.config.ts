import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { defaultContentPageLayout, defaultListPageLayout } from "./quartz.layout"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "super clark",
    pageTitleSuffix: ": the real punk rock",
    enableSPA: false,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "superclark.net",
    ignorePatterns: ["private", "Templates", ".obsidian", "Daily Notes", "Notes",],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Josefin Sans",    // --font-serif
        body: "Lora",    // --font-sans 
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#fffdf9",         // --color-light-cream (Background)
          lightgray: "#f2ede4",     // --color-tinted-cream (Borders/UI)
          gray: "#b8b8b8",          // --color-gray-500 (Subtitles)
          darkgray: "#4e4e4e",      // --color-gray-800 (Body text)
          dark: "#2b2b2b",          // (Headers)
          secondary: "#8b0000", // Superman Red
          tertiary: "#0d47a1",  // Superman Blue
          highlight: "rgba(255, 204, 51, 0.2)", // Yellow tintlights
          textHighlight: "#fff2aa", // Standard yellow highlight for searched text
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#ec4899",     // You can adjust these to a "Dark Crimson"
          tertiary: "#84e1bc",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa02",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts(), Plugin.ExplicitPublish()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(defaultContentPageLayout),
      Plugin.FolderPage(defaultListPageLayout),
      Plugin.TagPage(defaultListPageLayout),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssSlug: "feed",
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
