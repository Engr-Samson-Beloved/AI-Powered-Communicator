'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, MessageSquare, Mic, Repeat2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import './product-vision.css'

const scenarios = [
  { name: 'In the classroom', context: 'PRESENT AN IDEA', title: 'Let the idea land.', description: 'Practice explaining a topic, shaping a presentation, and making your point in a discussion.', prompt: 'What is the one idea you want your audience to remember?', answer: 'Start with the idea. Explain why it matters. Bring it to life with an example.', detail: 'For students and curious minds', visual: 'classroom' },
  { name: 'In an interview', context: 'TELL YOUR STORY', title: 'Show what you bring.', description: 'Prepare for role-specific questions and learn to connect your experience to a clear, relevant answer.', prompt: 'Tell me about a challenge you worked through.', answer: 'Set the scene. Explain what you did. Share the result and what you learned.', detail: 'For people preparing for their next opportunity', visual: 'interview' },
  { name: 'At work', context: 'MOVE A CONVERSATION FORWARD', title: 'Make the next step clear.', description: 'Build the clarity, structure, and pacing that help an idea move from a conversation into action.', prompt: 'How would you explain your recommendation?', answer: 'Name the recommendation. Give the reason. Make the next step easy to understand.', detail: 'For professionals and teams', visual: 'workplace' },
  { name: 'At your own pace', context: 'BUILD YOUR PRACTICE', title: 'Keep your voice yours.', description: 'Find a supportive routine that works with your speaking needs, chosen accent, and personal goals.', prompt: 'What would you like to feel better prepared to say?', answer: 'Start with a short phrase. Give yourself time. Practice again when you are ready.', detail: 'For different speaking styles and needs', visual: 'personal' },
]

export function ProductVision({ onBegin }: { onBegin: () => void }) {
  const reduceMotion = useReducedMotion()
  const [activeScenario, setActiveScenario] = useState(0)
  const scenario = scenarios[activeScenario]

  return (
    <div className="product-vision mx-auto max-w-6xl px-2 md:px-6">
      <section id="our-mission" className="mission-manifesto" aria-labelledby="mission-title">
        <div className="manifesto-topline"><span>OUR MISSION</span><span>01 / POSSIBILITY</span></div>
        <div className="manifesto-composition">
          <div className="manifesto-copy">
            <h2 id="mission-title">A voice<br />that opens<br /><em>doors.</em></h2>
            <p>We’re building a personal communication coach to help you turn what you want to say into something people understand.</p>
          </div>
          <div className="possibility-scene" aria-hidden="true">
            <svg viewBox="0 0 520 460" className="possibility-drawing">
              <g className="scene-floor"><path d="M15 380H505M30 415H490M70 450H450M105 365L70 450M210 365L195 450M310 365L325 450M415 365L450 450" /></g>
              <g className="scene-doors">
                <path d="M205 362V118H355V362M215 362V128H345V362" />
                <path d="M215 128L295 160V342L215 362Z" className="door-open" />
                <path d="M363 362V192H459V362M373 362V202H449V362" />
                <path d="M373 202L425 222V347L373 362Z" className="door-secondary" />
                <circle cx="280" cy="256" r="3" className="door-knob" />
              </g>
              <g className="scene-person">
                <circle cx="121" cy="229" r="20" />
                <path d="M102 256Q120 246 142 258L158 305L137 315L136 361H112L108 317L86 300Z" />
                <path d="M116 359L106 381H132M136 359L152 379H174" />
              </g>
              <g className="scene-sound"><path d="M150 229Q167 220 174 204M163 242Q193 223 203 193M168 255Q218 233 231 180" /></g>
              <path className="scene-path" d="M165 370C214 393 283 382 308 350S365 305 410 330" />
              <g className="scene-stars"><path d="M337 54V80M324 67H350M460 127V145M451 136H469" /><circle cx="72" cy="155" r="3" /></g>
            </svg>
            <span className="scene-caption scene-caption-one">An idea shared.</span>
            <span className="scene-caption scene-caption-two">An opportunity met.</span>
          </div>
        </div>
        <div className="manifesto-bottomline"><span>Your words. Your accent. Your pace.</span><p>The goal is a clearer connection, with room for every speaking style.</p></div>
      </section>

      <section className="achievement-section" aria-labelledby="goals-title">
        <div className="vision-heading"><span>WHAT WE WANT TO ACHIEVE</span><h2 id="goals-title">Small practice.<br /><em>Real possibilities.</em></h2><p>Our goal is a useful loop: understand what to work on, practice it, and see how you grow.</p></div>
        <div className="achievement-panels">
          <article className="achievement-panel achievement-clarity">
            <div className="panel-index"><span>01</span><MessageSquare size={19} aria-hidden="true" /></div>
            <div className="clarity-art" aria-hidden="true"><span className="thought-fragment">So… what I mean is…</span><div className="clarity-arrow"><ArrowRight size={22} /></div><strong>Here’s the idea.</strong><div className="clarity-lines"><i /><i /><i /></div></div>
            <h3>Make yourself understood.</h3><p>Shape a thought into a clear explanation, a structured answer, or a conversation that moves forward.</p>
          </article>
          <article className="achievement-panel achievement-practice">
            <div className="panel-index"><span>02</span><Repeat2 size={19} aria-hidden="true" /></div>
            <div className="practice-art" aria-hidden="true"><div className="practice-sheet"><span>YOUR NEXT SMALL STEP</span><b>One idea.<br />One sentence.</b><div><Check size={14} /> Try it in your own words</div></div><span className="practice-repeat"><Repeat2 size={22} /></span></div>
            <h3>Turn insight into action.</h3><p>Connect specific challenges to focused exercises, then bring what you’ve practiced into your next attempt.</p>
          </article>
          <article className="achievement-panel achievement-growth">
            <div className="panel-index"><span>03</span><ArrowUpRight size={20} aria-hidden="true" /></div>
            <div className="growth-art" aria-hidden="true"><svg viewBox="0 0 280 130"><path className="growth-grid" d="M10 30H270M10 70H270M10 110H270" /><path className="growth-route" d="M18 105L64 94L105 99L146 66L186 73L222 40L264 22" /><circle cx="18" cy="105" r="5" /><circle cx="146" cy="66" r="5" /><circle cx="264" cy="22" r="5" /></svg><div><span>A starting point</span><span>A next step</span></div><small>ILLUSTRATING THE GOAL, NOT LIVE RESULTS</small></div>
            <h3>Recognize your progress.</h3><p>Compare similar practice tasks and see examples of what changed, so growth means more than a number.</p>
          </article>
        </div>
      </section>

      <section className="scenario-section" aria-labelledby="audience-title">
        <div className="scenario-heading"><span>WHERE IT CAN TAKE YOU</span><h2 id="audience-title">Life gives you<br /><em>the conversation.</em><br />We’re building<br />the practice space.</h2>
          <div className="scenario-selector" role="group" aria-label="Explore communication goals">
            {scenarios.map((item, index) => <button key={item.name} type="button" aria-pressed={index === activeScenario} aria-controls="scenario-detail" onClick={() => setActiveScenario(index)}><span>{item.name}</span><ArrowUpRight size={17} aria-hidden="true" /></button>)}
          </div>
        </div>
        <div id="scenario-detail" className={'scenario-stage scenario-' + scenario.visual} aria-live="polite" aria-atomic="true">
          <motion.div key={scenario.name} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.3 }}>
            <span className="scenario-context">{scenario.context}</span>
            <div className="conversation-art" aria-hidden="true"><div className="conversation-prompt"><span><MessageSquare size={15} /> A moment to prepare for</span><p>{scenario.prompt}</p></div><div className="conversation-answer"><Mic size={18} /><p>{scenario.answer}</p></div><div className="conversation-wave">{Array.from({ length: 32 }, (_, index) => <i key={index} style={{ height: 6 + ((index * 11) % 25), animationDelay: index * -0.08 + 's' }} />)}</div></div>
            <h3>{scenario.title}</h3><p className="scenario-description">{scenario.description}</p><span className="scenario-audience">{scenario.detail}</span>
          </motion.div>
        </div>
      </section>

      <section className="vision-closing" aria-labelledby="direction-title">
        <div className="closing-path" aria-hidden="true"><span>Speak</span><ArrowRight size={16} /><span>Understand</span><ArrowRight size={16} /><span>Practice</span><ArrowRight size={16} /><span>Grow</span></div>
        <span className="closing-eyebrow">THE DIRECTION WE’RE BUILDING TOWARD</span>
        <h2 id="direction-title">Better prepared.<br /><em>Still entirely you.</em></h2>
        <p>Natural voice conversations, practical feedback, focused exercises, and progress you can understand. Shaped around your goals and speaking preferences.</p>
        <Button onClick={onBegin} className="vision-start-button">Explore the current practice experience <ArrowUpRight className="h-4 w-4" /></Button>
        <small>Supportive communication practice. Clinical diagnosis and therapy are outside the initial product’s scope.</small>
      </section>
    </div>
  )
}
