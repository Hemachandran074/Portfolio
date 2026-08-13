import type { Project } from '../data/projects'

type ProjectCardProps = {
  project: Project
  onOpen: (project: Project) => void
}

/**
 * Project thumbnail: 861x487, radius/xl, interactive/primary fill.
 * Clicking opens the project's detail card.
 *
 * The reference shows these as flat black placeholders, so the thumbnail image
 * and the hover title are additions needed to make the card usable.
 */
function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open details for ${project.title}`}
      className="group relative block aspect-[861/487] w-full cursor-pointer overflow-hidden rounded-xl bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink dark:focus-visible:outline-on-dark"
    >
      <img
        src={project.image}
        alt=""
        loading="lazy"
        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
      />

      {/* Scrim, so the title stays legible over any thumbnail. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />

      <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-lg p-2xl text-left opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
        <span>
          <span className="block font-display text-thumb-title uppercase text-on-dark">
            {project.title}
          </span>
          <span className="mt-1 block text-subtitle text-on-dark/75">
            {project.subtitle}
          </span>
        </span>
        <span className="hidden shrink-0 text-button font-semibold text-on-dark sm:block">
          View project
        </span>
      </span>
    </button>
  )
}

export default ProjectCard
