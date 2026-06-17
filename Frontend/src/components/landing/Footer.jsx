import { BRAND_NAME, BrandLogo } from '../brand/BrandLogo'

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Resources: ['Documentation', 'API', 'Support', 'Status'],
  Legal: ['Privacy', 'Terms', 'Security'],
}

export function Footer() {
  return (
    <footer className="bg-bg-card border-t border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo to="/" size="lg" rounded="full" className="mb-4" />
            <p className="text-sm text-text-muted leading-relaxed">
              An AI-powered autonomous interviewer that screens, evaluates and ranks candidates through intelligent avatar-based interviews.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-text-primary mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border-default flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">&copy; 2026 {BRAND_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-text-muted hover:text-text-primary">Twitter</a>
            <a href="#" className="text-sm text-text-muted hover:text-text-primary">LinkedIn</a>
            <a href="#" className="text-sm text-text-muted hover:text-text-primary">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
