import ArrowLink from '../components/ArrowLink'
import ConnectCTA from '../components/ConnectCTA'
import MaskReveal from '../components/MaskReveal'
import TechIcon from '../components/TechIcon'
import {
  education,
  intro,
  organization,
  socialLinks,
  techStack,
  type AboutEntry,
  type EntryLine,
} from '../data/about'

const LINE_TONE: Record<NonNullable<EntryLine['tone']>, string> = {
  strong: 'font-semibold text-ink dark:text-on-dark',
  default: 'text-ink dark:text-on-dark',
  muted: 'text-muted dark:text-on-dark/60',
}

/**
 * Education / Organization block: a title, then entries laid out as a fixed
 * left meta column and a stack of detail lines. Stacks vertically below 700px.
 */
function EntryGroup({
  title,
  entries,
}: {
  title: string
  entries: AboutEntry[]
}) {
  return (
    <section className="mt-6xl">
      <h3 className="text-title font-medium text-ink dark:text-on-dark">
        {title}
      </h3>

      <div className="mt-xl flex flex-col gap-xl">
        {entries.map((entry) => (
          <div
            key={entry.meta}
            className="flex flex-col gap-md min-[700px]:flex-row min-[700px]:gap-0"
          >
            <div className="w-about-meta shrink-0">
              {entry.href ? (
                <ArrowLink
                  href={entry.href}
                  className="text-entry font-semibold text-ink dark:text-on-dark"
                >
                  {entry.meta}
                </ArrowLink>
              ) : (
                <p className="text-entry font-semibold text-ink dark:text-on-dark">
                  {entry.meta}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-entry-line">
              {entry.lines.map((line) => (
                <p
                  key={line.text}
                  className={`text-entry ${LINE_TONE[line.tone ?? 'default']}`}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * About Me page (1440x2308 reference).
 * White background, centered Display/Section heading, then a left-aligned
 * content column: intro copy, Education, Organization, the tech stack grid,
 * and a centered CTA closing with "Let's Connect.".
 */
function About() {
  return (
    <section
      id="about"
      className="bg-page pt-about-top pb-section dark:bg-page-dark"
    >
      {/* 906 - 2x20 padding leaves an 866px content box: the reference column
          width, and exactly wide enough for 11 icon boxes per row. */}
      <div className="mx-auto flex w-full max-w-[906px] flex-col px-lg">
        <MaskReveal
          as="h2"
          lines={['About', 'Me.']}
          className="text-center font-display text-section uppercase text-ink dark:text-on-dark"
        />

        <MaskReveal
          as="p"
          lines={[intro]}
          stagger={{ amount: 0.6 }}
          className="mt-5xl max-w-[830px] text-large text-ink dark:text-on-dark"
        />

        <EntryGroup title="Education" entries={education} />
        <EntryGroup title="Organization" entries={organization} />

        <section className="mt-6xl">
          <h3 className="text-title font-medium text-ink dark:text-on-dark">
            Tech Stack
          </h3>

          {/* 866px of column fits exactly 11 of these boxes per row, which is
              how the reference breaks. */}
          <ul className="mt-5xl flex list-none flex-wrap gap-x-icon-x gap-y-icon-y p-0">
            {techStack.map((item) => (
              <TechIcon key={item.label} item={item} />
            ))}
          </ul>
        </section>

        <div className="mt-about-cta text-center">
          <MaskReveal
            as="p"
            lines={['Want to reach out me or', 'just want to say friendly hello?']}
            stagger={{ amount: 0.4 }}
            className="text-callout font-medium text-ink dark:text-on-dark"
          />

          <ConnectCTA className="mt-8xl" />

          <nav
            aria-label="Elsewhere"
            className="mt-6xl flex flex-wrap items-center justify-center gap-x-links gap-y-lg"
          >
            {socialLinks.map((link) => (
              <ArrowLink
                key={link.label}
                href={link.href}
                arrowClassName="size-[13px]"
                className="text-name text-ink dark:text-on-dark underline"
              >
                {link.label}
              </ArrowLink>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}

export default About
