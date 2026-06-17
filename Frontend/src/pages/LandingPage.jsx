import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bot, Zap, Calendar, BarChart3, FileText, Users, ArrowRight, Play,
  CheckCircle, ChevronDown, Star, Shield, Clock, TrendingUp,
} from 'lucide-react'
import { Navbar } from '../components/landing/Navbar'
import { Footer } from '../components/landing/Footer'
import { RoleSelectionModal } from '../components/ui/RoleSelectionModal'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { landingFeatures, howItWorks, testimonials, faqs } from '../services/mockData'

const iconMap = { Bot, Zap, Calendar, BarChart3, FileText, Users }

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [actionType, setActionType] = useState('signin')

  const openRoleModal = (type) => {
    setActionType(type)
    setSelectedRole(null)
    setModalOpen(true)
  }

  const closeRoleModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar onActionClick={openRoleModal} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-4xl mx-auto">
          <Badge variant="primary" className="mb-6">AI Interviewer Platform</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
            Hire Smarter with{' '}
            <span className="text-gradient-brand">AI-Powered Interviews</span>
          </h1>
          <p className="text-lg text-text-tertiary mb-10 max-w-2xl mx-auto">
            Automate screening interviews with intelligent AI avatars and instant candidate evaluation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" icon={ArrowRight} onClick={() => openRoleModal('starthiring')}>Start Hiring</Button>
            <Button size="lg" variant="secondary" icon={Play}>Watch Demo</Button>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="rounded-2xl border border-border-default bg-bg-card shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-bg-subtle border-b border-border-default">
              <div className="w-3 h-3 rounded-full bg-error/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-2 text-xs text-text-muted">MockMate — Dashboard</span>
            </div>
            <div className="p-6 sm:p-8 bg-gradient-brand-subtle">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Interviews', value: '128', icon: FileText },
                  { label: 'Screened', value: '342', icon: Users },
                  { label: 'Avg Score', value: '74%', icon: TrendingUp },
                  { label: 'Recommended', value: '48', icon: Star },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-card rounded-xl p-4 border border-border-default">
                    <s.icon className="w-4 h-4 text-brand-primary mb-2" />
                    <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                    <p className="text-xs text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="h-32 bg-bg-card rounded-xl border border-border-default flex items-center justify-center">
                <p className="text-sm text-text-muted">Interview Activity Chart Preview</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-card border-y border-border-default">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Everything you need to hire faster</h2>
            <p className="text-text-tertiary max-w-2xl mx-auto">Powerful features designed for modern recruiting teams.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingFeatures.map((f, i) => {
              const Icon = iconMap[f.icon]
              return (
                <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                  <Card hover className="h-full">
                    <div className="w-10 h-10 rounded-lg bg-bg-brand flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{f.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{f.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-4">How it works</h2>
          <p className="text-text-tertiary">From setup to hire in four simple steps.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((step, i) => (
            <motion.div key={step.step} {...fadeUp} transition={{ delay: i * 0.1 }} className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-brand text-white flex items-center justify-center font-bold text-sm mb-4">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-text-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-subtle">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Why teams choose MockMate </h2>
            <div className="space-y-4">
              {[
                { icon: Clock, text: 'Reduce screening time by up to 70%' },
                { icon: Shield, text: 'Consistent, bias-free candidate evaluations' },
                { icon: TrendingUp, text: '89% candidate completion rate' },
                { icon: CheckCircle, text: 'SOC 2 compliant data security' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <b.icon className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-text-secondary">{b.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-brand-subtle border-brand-primary/10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-tertiary">Time Saved</span>
                  <span className="text-2xl font-bold text-success">70%</span>
                </div>
                <div className="h-2 bg-bg-card rounded-full"><div className="h-full w-[70%] bg-success rounded-full" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-tertiary">Completion Rate</span>
                  <span className="text-2xl font-bold text-brand-primary">89%</span>
                </div>
                <div className="h-2 bg-bg-card rounded-full"><div className="h-full w-[89%] bg-brand-primary rounded-full" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-tertiary">Eval Accuracy</span>
                  <span className="text-2xl font-bold text-accent-sky">92%</span>
                </div>
                <div className="h-2 bg-bg-card rounded-full"><div className="h-full w-[92%] bg-accent-sky rounded-full" /></div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Demo Flow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">See it in action</h2>
          <p className="text-text-tertiary">Watch how a typical screening interview flows.</p>
        </motion.div>
        <motion.div {...fadeUp} className="grid md:grid-cols-3 gap-6">
          {['Create & Configure', 'Candidate Interviews', 'Review & Decide'].map((step, i) => (
            <Card key={step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-bg-brand mx-auto mb-4 flex items-center justify-center text-brand-primary font-bold">
                {i + 1}
              </div>
              <h3 className="font-semibold text-text-primary mb-2">{step}</h3>
              <p className="text-sm text-text-muted">
                {i === 0 && 'Set role, difficulty, and questions. Generate a shareable link in seconds.'}
                {i === 1 && 'AI avatar conducts natural conversations with real-time transcription.'}
                {i === 2 && 'Get scores, strengths, weaknesses, and hiring recommendations instantly.'}
              </p>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-card border-y border-border-default">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Trusted by hiring teams</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.author} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-text-secondary mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{t.author}</p>
                    <p className="text-xs text-text-muted">{t.role}, {t.company}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Frequently asked questions</h2>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.details key={i} {...fadeUp} transition={{ delay: i * 0.05 }} className="group">
              <summary className="flex items-center justify-between cursor-pointer p-5 bg-bg-card rounded-xl border border-border-default hover:border-border-strong transition-colors list-none">
                <span className="font-medium text-text-primary pr-4">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-text-muted shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 pt-2 text-sm text-text-muted leading-relaxed">{faq.answer}</div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center bg-gradient-brand rounded-2xl p-12 sm:p-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your hiring?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Start screening candidates with AI today. No credit card required.
          </p>
          <Button
            size="lg"
            className="bg-white text-brand-primary hover:bg-bg-subtle"
            onClick={() => openRoleModal('starthiring')}
          >
            Get Started Free
          </Button>
        </motion.div>
      </section>

      <RoleSelectionModal
        open={modalOpen}
        actionType={actionType}
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
        onClose={closeRoleModal}
      />
      <Footer />
    </div>
  )
}
