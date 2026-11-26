import type { Project } from '../data/projects'
import { ArrowUpRightIcon } from './icons'

type ProjectCardProps = {
  project: Project
  onOpen: (project: Project) => void
}

/**
 * Bento grid project card:
 * Features a top media preview with curved bottom edges (rounded-2xl) and
 * smooth hover scale, nested within a solid gray card container displaying
 * the project name styled in font Medium (Delight Medium, weight 500).
 *
 * Clicking or pressing Enter/Space opens the project detail modal.
 */
function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open details for ${project.title}`}
      className="group relative flex aspect-[4/3.5] w-full cursor-pointer overflow-hidden rounded-2xl bg-ink text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink dark:focus-visible:outline-on-dark"
    >
      <img
        src={project.image}
        alt={project.imageAlt || project.title}
        loading="lazy"
        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
      />

      {/* Subtle hover gradient wash */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
      />

      {/* Subtle interactive hover cue in top right */}
      <span
        aria-hidden="true"
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:top-5 sm:right-5 sm:size-11"
      >
        <ArrowUpRightIcon className="size-4.5" />
      </span>
    </button>
  )
}

export default ProjectCard
