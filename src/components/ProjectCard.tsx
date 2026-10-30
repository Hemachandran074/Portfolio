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
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-project-card text-left transition-all duration-300 hover:-translate-y-1 hover:bg-[#5a5a5a] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink dark:bg-[#404040] dark:hover:bg-[#4a4a4a] dark:focus-visible:outline-on-dark"
    >
      {/* Top media / thumbnail area with curved bottom edges */}
      <div className="relative aspect-[4/3.5] w-full overflow-hidden rounded-2xl bg-ink">
        <img
          src={project.image}
          alt={project.imageAlt || project.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />

        {/* Subtle hover gradient wash */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        />
      </div>

      {/* Bento footer bar with project name in font Medium */}
      <div className="flex h-14 items-center justify-between px-5 sm:h-16 sm:px-6">
        <span className="font-sans font-medium text-white text-base tracking-normal sm:text-lg">
          {project.title}
        </span>

        {/* Interactive cue on hover/focus */}
        <span
          aria-hidden="true"
          className="shrink-0 text-white/80 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
        >
          <ArrowUpRightIcon className="size-4.5" />
        </span>
      </div>
    </button>
  )
}

export default ProjectCard
