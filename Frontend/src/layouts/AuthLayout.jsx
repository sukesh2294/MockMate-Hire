import { motion } from 'framer-motion'
import { BRAND_NAME, BrandLogo, BrandMark } from '../components/brand/BrandLogo'

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand-subtle items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <BrandMark size="lg" rounded="xl" className="mb-6" />
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Hire smarter with AI-powered interviews
          </h2>
          <p className="text-text-tertiary leading-relaxed">
            Join thousands of recruiters using {BRAND_NAME} to automate screening,
            evaluate candidates instantly, and make data-driven hiring decisions.
          </p>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-bg-base">
        <div className="w-full max-w-md">
          <BrandLogo to="/" size="sm" className="mb-8 lg:hidden" />
          {title && <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>}
          {subtitle && <p className="text-text-muted mb-8">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}
