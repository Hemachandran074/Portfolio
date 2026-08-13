import { useCallback, useState } from 'react'
import { projects, type Project } from '../data/projects'
import ProjectCard from '../components/ProjectCard'
import ProjectDetail from '../components/ProjectDetail'

/**
 * Projects page (1440x1973 reference).
 * White background, centered Display/Section heading over a Body/Subtitle
 * description, then the 861x487 thumbnails stacked one per row.
 */
function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  const closeDetail = useCallback(() => setActive(null), [])

  return (
    <section
      id="project"
      className="bg-page pt-projects-top pb-8xl dark:bg-page-dark"
    >
      <h2 className="text-center font-display text-section uppercase text-ink dark:text-on-dark">
        <span className="block">Project</span>
        <span className="block">Works.</span>
      </h2>

      {/* Pulled up 10px: the 128px heading's line box extends below its caps,
          and the reference sets the description against the caps. */}
      <p className="mt-[calc(clamp(4px,0.694vw,10px)*-1)] px-lg text-center text-subtitle uppercase text-ink dark:text-on-dark">
        <span className="block max-[700px]:inline">
          A collection of work, past and present, built to solve,{' '}
        </span>
        <span className="block max-[700px]:inline">
          explore and experiment. From web and product, to AI{' '}
        </span>
        <span className="block max-[700px]:inline">
          and digital experiences that push what&rsquo;s possible.
        </span>
      </p>

      <div className="mx-auto mt-projects-lead flex w-full max-w-[901px] flex-col gap-card-gap px-lg">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={setActive} />
        ))}
      </div>

      {active && <ProjectDetail project={active} onClose={closeDetail} />}
    </section>
  )
}

export default Projects