import { SplineSceneBasic } from '@/components/spline-scene-basic'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, MessageSquare, Brain } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Brain className="h-8 w-8 text-blue-500" />
            <span className="text-white">
              AI Communicator
            </span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Features
            </Button>
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Pricing
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <SplineSceneBasic>
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-balance text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                The Future of Communication
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-slate-300">
                Harness the power of AI to communicate smarter, faster, and more effectively. Experience intelligent conversations powered by advanced machine learning.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button size="lg" className="gap-2 bg-blue-600 px-8 hover:bg-blue-700 text-white">
                Start Communicating
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-900 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </SplineSceneBasic>
      </section>

      {/* Features Section */}
      <section className="relative z-10 border-t border-slate-800 bg-black py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Powered by Intelligence
            </h2>
            <p className="text-xl text-slate-400">
              Cutting-edge AI technology for seamless communication
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-8 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Lightning Fast</h3>
              <p className="text-slate-400">
                Get instant AI-powered responses in milliseconds. Experience real-time communication like never before.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-8 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-900">
                <MessageSquare className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Smart Conversations</h3>
              <p className="text-slate-400">
                Natural language understanding that truly comprehends context and nuance for better interactions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-8 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900">
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Continuously Learning</h3>
              <p className="text-slate-400">
                Advanced ML models that improve and adapt with every interaction for smarter responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-slate-800 bg-black py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Ready to Transform Communication?
          </h2>
          <p className="mb-8 text-xl text-slate-300">
            Join thousands of users experiencing the future of AI-powered communication today.
          </p>
          <Button
            size="lg"
            className="gap-2 bg-blue-600 px-8 hover:bg-blue-700 text-white"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-black py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-slate-500">
          <p>© 2024 AI Powered Communicator. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
