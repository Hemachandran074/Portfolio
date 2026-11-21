import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import SmoothScroll from './components/SmoothScroll'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import About from './sections/About'
import BottomBlur from './components/BottomBlur'

function App() {
  /**
   * Once the reveal finishes the preloader unmounts for good. Because this
   * lives above the router-less section tree, in-page navigation can never
   * bring it back.
   */
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])

  return (
    <SmoothScroll>
      {/* Sections render underneath from the first frame, so the wipe uncovers
          a laid-out hero instead of popping one in. */}
      <Navbar />
      <Hero revealed={revealed} />
      <Projects />
      <About />

      <BottomBlur />

      {!revealed && <Preloader onComplete={reveal} />}
    </SmoothScroll>
  )
}

export default App
