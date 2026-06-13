import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const TOOLS = [
  {
    id: 'tenant-email', icon: '✉️', name: 'Tenant Email Writer', free: true,
    desc: 'Professional emails for late rent, complaints, repairs, move-out notices.',
    fields: [
      { id: 'situation', label: 'What happened?', type: 'textarea', placeholder: 'e.g. Tenant is 2 weeks late on rent and not responding...' },
      { id: 'tone', label: 'Tone', type: 'select', options: ['Professional & firm', 'Friendly reminder', 'Final warning', 'Understanding & flexible'] },
      { id: 'landlordName', label: 'Your name', type: 'input', placeholder: 'John Smith' },
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
    ],
    prompt: (f) => `Write a professional landlord email. Situation: ${f.situation}. Tone: ${f.tone || 'Professional'}. From: ${f.landlordName || 'Landlord'}. To: ${f.tenantName || 'Tenant'}. Write a complete ready-to-send email. Professional and legally appropriate. Just the email, no explanation.`
  },
  {
    id: 'lease-clause', icon: '📋', name: 'Lease Clause Generator', free: true,
    desc: 'Airtight clauses for pets, parking, smoking, utilities, subletting and more.',
    fields: [
      { id: 'topic', label: 'What clause do you need?', type: 'input', placeholder: 'e.g. No smoking policy, pet policy, parking rules...' },
      { id: 'state', label: 'State / Country', type: 'input', placeholder: 'e.g. Texas, California, UK' },
      { id: 'details', label: 'Specific details', type: 'textarea', placeholder: 'e.g. Allow 1 small dog under 25lbs, $500 pet deposit required...' },
    ],
    prompt: (f) => `Write a professional lease clause for: ${f.topic}. State: ${f.state || 'General'}. Details: ${f.details || 'Standard terms'}. Clear, legally appropriate, ready to add to a rental agreement. Just the clause, no explanation.`
  },
  {
    id: 'listing', icon: '🏠', name: 'Rental Listing Writer', free: true,
    desc: 'Compelling listings that attract quality tenants fast.',
    fields: [
      { id: 'bedrooms', label: 'Bedrooms / Bathrooms', type: 'input', placeholder: '3 bed / 2 bath' },
      { id: 'location', label: 'Location', type: 'input', placeholder: 'Austin, TX — Hyde Park' },
      { id: 'rent', label: 'Monthly rent', type: 'input', placeholder: '$1,850/month' },
      { id: 'features', label: 'Features & amenities', type: 'textarea', placeholder: 'Updated kitchen, hardwood floors, in-unit laundry, backyard, pet friendly...' },
    ],
    prompt: (f) => `Write an attractive rental listing. ${f.bedrooms} | ${f.location} | ${f.rent}/mo. Features: ${f.features}. Catchy headline, engaging description, bullet points. Ready to post on Zillow/Craigslist. Make it stand out.`
  },
  {
    id: 'late-notice', icon: '⚠️', name: 'Late Payment Notice', free: false,
    desc: 'Formal late payment notices and pay-or-quit letters.',
    fields: [
      { id: 'tenantName', label: "Tenant's full name", type: 'input', placeholder: 'Jane Doe' },
      { id: 'address', label: 'Property address', type: 'input', placeholder: '123 Main St, Austin TX 78701' },
      { id: 'amountDue', label: 'Amount owed', type: 'input', placeholder: '$1,850' },
      { id: 'daysLate', label: 'Days past due', type: 'input', placeholder: '14 days' },
      { id: 'state', label: 'State', type: 'input', placeholder: 'Texas' },
    ],
    prompt: (f) => `Write a formal late rent notice. Tenant: ${f.tenantName}. Property: ${f.address}. Amount: ${f.amountDue}. Days late: ${f.daysLate}. State: ${f.state}. Professional, firm, legally appropriate. Include deadline and consequences. Just the letter.`
  },
  {
    id: 'maintenance', icon: '🔧', name: 'Maintenance Response', free: false,
    desc: 'Reply to maintenance requests professionally and document everything.',
    fields: [
      { id: 'issue', label: "Tenant's maintenance request", type: 'textarea', placeholder: 'Tenant says kitchen sink is leaking...' },
      { id: 'response', label: 'Your plan', type: 'input', placeholder: 'Sending plumber Tuesday between 10am-2pm' },
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
    ],
    prompt: (f) => `Write a professional landlord maintenance response. Request: ${f.issue}. My plan: ${f.response}. Tenant: ${f.tenantName || 'Tenant'}. Acknowledge issue, explain what happens and when, document properly. Just the message.`
  },
  {
    id: 'screening', icon: '🔍', name: 'Tenant Screening Questions', free: false,
    desc: 'Legal screening questions and application templates.',
    fields: [
      { id: 'propertyType', label: 'Property type', type: 'input', placeholder: '2-bed apartment, single family home' },
      { id: 'concerns', label: 'Any specific concerns?', type: 'textarea', placeholder: 'Want stable income, no prior evictions, good references...' },
    ],
    prompt: (f) => `Generate a comprehensive tenant screening questionnaire for: ${f.propertyType}. Concerns: ${f.concerns || 'Standard screening'}. Income, employment, rental history, references, lifestyle. All questions fair housing compliant. Numbered list format.`
  },
  {
    id: 'rent-increase', icon: '📈', name: 'Rent Increase Notice', free: false,
    desc: 'Professional rent increase letters with proper notice periods.',
    fields: [
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
      { id: 'address', label: 'Property address', type: 'input', placeholder: '123 Main St, Austin TX' },
      { id: 'currentRent', label: 'Current rent', type: 'input', placeholder: '$1,500/month' },
      { id: 'newRent', label: 'New rent', type: 'input', placeholder: '$1,650/month' },
      { id: 'effectiveDate', label: 'Effective date', type: 'input', placeholder: 'August 1, 2026' },
      { id: 'state', label: 'State', type: 'input', placeholder: 'Texas' },
    ],
    prompt: (f) => `Write a professional rent increase notice. Tenant: ${f.tenantName}. Property: ${f.address}. Current rent: ${f.currentRent}. New rent: ${f.newRent}. Effective: ${f.effectiveDate}. State: ${f.state}. Polite but firm, legally appropriate. Just the letter.`
  },
  {
    id: 'lease-renewal', icon: '🔄', name: 'Lease Renewal Letter', free: false,
    desc: 'Lease renewal offers that retain great tenants.',
    fields: [
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
      { id: 'address', label: 'Property address', type: 'input', placeholder: '123 Main St' },
      { id: 'currentExpiry', label: 'Current lease expires', type: 'input', placeholder: 'July 31, 2026' },
      { id: 'newTerm', label: 'New lease term', type: 'input', placeholder: '12 months' },
      { id: 'newRent', label: 'New monthly rent', type: 'input', placeholder: '$1,600/month (or same)' },
      { id: 'deadline', label: 'Response deadline', type: 'input', placeholder: 'July 1, 2026' },
    ],
    prompt: (f) => `Write a friendly lease renewal offer. Tenant: ${f.tenantName}. Property: ${f.address}. Expires: ${f.currentExpiry}. New term: ${f.newTerm}. New rent: ${f.newRent}. Respond by: ${f.deadline}. Warm, professional, encourages renewal. Just the letter.`
  },
  {
    id: 'move-in-checklist', icon: '📝', name: 'Move-In Checklist', free: false,
    desc: 'Detailed move-in inspection checklists to protect your deposit.',
    fields: [
      { id: 'propertyType', label: 'Property type', type: 'input', placeholder: '3-bedroom house, 2-bed apartment' },
      { id: 'rooms', label: 'Rooms to include', type: 'textarea', placeholder: 'Living room, 3 bedrooms, 2 bathrooms, kitchen, laundry, garage, backyard...' },
    ],
    prompt: (f) => `Create a detailed move-in condition checklist for: ${f.propertyType}. Rooms: ${f.rooms}. Include every area with checkboxes for condition (Excellent/Good/Fair/Poor) and notes. Professional format, protects both landlord and tenant. Include signature lines at the end.`
  },
  {
    id: 'noise-complaint', icon: '🔊', name: 'Noise Complaint Letter', free: false,
    desc: 'Handle noise complaints professionally and legally.',
    fields: [
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
      { id: 'complaint', label: 'What was reported?', type: 'textarea', placeholder: 'Loud music after 11pm on weeknights, complaints from neighbors in units 2 and 4...' },
      { id: 'warning', label: 'Is this a first warning?', type: 'select', options: ['First warning', 'Second warning', 'Final warning before lease action'] },
    ],
    prompt: (f) => `Write a noise complaint letter to tenant. Tenant: ${f.tenantName}. Complaint: ${f.complaint}. Warning level: ${f.warning || 'First warning'}. Professional, references lease quiet hours policy, states consequences. Just the letter.`
  },
  {
    id: 'pet-approval', icon: '🐾', name: 'Pet Approval / Denial', free: false,
    desc: 'Approve or deny pet requests with proper documentation.',
    fields: [
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
      { id: 'petDetails', label: 'Pet details', type: 'input', placeholder: '1 golden retriever, 4 years old, 65lbs' },
      { id: 'decision', label: 'Decision', type: 'select', options: ['Approve with conditions', 'Deny request'] },
      { id: 'conditions', label: 'Conditions or reason for denial', type: 'textarea', placeholder: 'e.g. $500 pet deposit required, must be kept on leash in common areas, OR: building policy does not allow dogs over 25lbs' },
    ],
    prompt: (f) => `Write a pet request ${f.decision?.includes('Approve') ? 'approval' : 'denial'} letter. Tenant: ${f.tenantName}. Pet: ${f.petDetails}. Decision: ${f.decision}. Details: ${f.conditions}. Professional, clear terms, protects landlord. Just the letter.`
  },
  {
    id: 'security-deposit', icon: '💰', name: 'Security Deposit Return', free: false,
    desc: 'Security deposit return letters with itemized deductions.',
    fields: [
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
      { id: 'address', label: 'Property address', type: 'input', placeholder: '123 Main St' },
      { id: 'depositAmount', label: 'Total deposit held', type: 'input', placeholder: '$1,500' },
      { id: 'deductions', label: 'Deductions (if any)', type: 'textarea', placeholder: 'e.g. Carpet cleaning: $150, Broken window: $200, OR: No deductions, full amount returned' },
      { id: 'state', label: 'State', type: 'input', placeholder: 'Texas' },
    ],
    prompt: (f) => `Write a security deposit return letter. Tenant: ${f.tenantName}. Property: ${f.address}. Deposit: ${f.depositAmount}. Deductions: ${f.deductions}. State: ${f.state}. Itemized breakdown, professional, legally appropriate. Include total returned. Just the letter.`
  },
]

const FREE_LIMIT = 3

const FAQS = [
  { q: 'Is this actually legal advice?', a: 'No — LandlordAI generates document templates and drafts only. Always have an attorney review any legal document before use, especially eviction notices. Laws vary by state.' },
  { q: 'How many tools are included in the free plan?', a: 'The free plan gives you 3 generations across all tools. After that, upgrade to Pro for unlimited access to all 12 tools.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes. Cancel anytime, no questions asked. You keep access until the end of your billing period.' },
  { q: 'Is my data secure?', a: 'We do not store documents you generate. Text is processed by Claude AI and returned to you. We collect your email only if you sign up for updates.' },
  { q: 'What states does this work for?', a: 'All 50 US states and many international locations. For best results, enter your state when the tool asks for it so the AI can tailor language appropriately.' },
  { q: 'Can I use this for commercial properties?', a: 'Yes! The tools work for residential and commercial landlords. Just describe your situation and the AI will adapt accordingly.' },
]

export default function Home() {
  const router = useRouter()
  const [view, setView] = useState('home')
  const [activeTool, setActiveTool] = useState(TOOLS[0])
  const [fields, setFields] = useState({})
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [pendingGenerate, setPendingGenerate] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const updateField = (id, val) => setFields(f => ({ ...f, [id]: val }))

  const selectTool = (tool) => {
    setActiveTool(tool)
    setFields({})
    setOutput('')
  }

  const handleGenerate = () => {
    if (!emailSubmitted && usageCount >= 1) {
      setShowEmailGate(true)
      setPendingGenerate(true)
      return
    }
    generate()
  }

  const submitEmail = () => {
    if (!email.includes('@')) return
    setEmailSubmitted(true)
    setShowEmailGate(false)
    if (pendingGenerate) { setPendingGenerate(false); generate() }
  }

  const generate = async () => {
    if (usageCount >= FREE_LIMIT) return
    setLoading(true)
    setOutput('')
    try {
      const prompt = activeTool.prompt(fields)
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      setOutput(data.text || 'Something went wrong. Please try again.')
      setUsageCount(c => c + 1)
    } catch {
      setOutput('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const lines = doc.splitTextToSize(output, 170)
    doc.setFontSize(11)
    doc.text(lines, 20, 20)
    doc.save(`${activeTool.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
  }

  const usageLeft = FREE_LIMIT - usageCount
  const usagePillClass = usageLeft <= 0 ? 'danger' : usageLeft === 1 ? 'warning' : ''

  return (
    <>
      <Head>
        <title>LandlordAI — 12 AI Tools for Property Managers</title>
        <meta name="description" content="Write tenant emails, lease clauses, rental listings, eviction notices, rent increases and more in seconds. The complete AI toolkit for landlords." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="LandlordAI — AI tools for landlords" />
        <meta property="og:description" content="Stop dreading landlord paperwork. Generate professional documents in seconds." />
      </Head>

      {/* EMAIL GATE */}
      {showEmailGate && (
        <div className="email-gate">
          <div className="email-gate-box">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
            <h2>Get your free documents</h2>
            <p>Enter your email to continue generating documents. No spam — just occasional product updates.</p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitEmail()}
            />
            <button className="primary" style={{ width: '100%', padding: '12px', fontSize: 15 }} onClick={submitEmail}>
              Continue for free →
            </button>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 10 }}>No credit card. Unsubscribe anytime.</p>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav>
        <div className="logo" onClick={() => setView('home')}>🏠 Landlord<em>AI</em></div>
        <div className="nav-links">
          <button onClick={() => setView('pricing')}>Pricing</button>
          <button className="primary" onClick={() => setView('app')}>Try free →</button>
        </div>
      </nav>

      {/* HOME */}
      {view === 'home' && (
        <>
          <div className="hero">
            <div className="hero-badge">✦ Powered by Claude AI · 12 tools for landlords</div>
            <h1>Stop dreading<br /><em>landlord paperwork</em></h1>
            <p>Write professional tenant emails, lease clauses, eviction notices, rent increases and more in under 30 seconds. Built for landlords who have properties to manage, not documents to write.</p>
            <div className="hero-btns">
              <button className="primary" onClick={() => setView('app')} style={{ fontSize: 16, padding: '13px 32px' }}>Try free — no signup →</button>
              <button onClick={() => setView('pricing')} style={{ fontSize: 16, padding: '13px 24px' }}>See pricing</button>
            </div>
            <div className="hero-trust">
              <div className="trust-item"><span>✓</span> No legal jargon</div>
              <div className="trust-item"><span>✓</span> Download as PDF</div>
              <div className="trust-item"><span>✓</span> Works in all 50 states</div>
              <div className="trust-item"><span>✓</span> Cancel anytime</div>
            </div>
          </div>

          <div className="stats">
            <div className="stat"><div className="stat-num">12</div><div className="stat-label">AI tools</div></div>
            <div className="stat"><div className="stat-num">&lt;30s</div><div className="stat-label">Per document</div></div>
            <div className="stat"><div className="stat-num">50</div><div className="stat-label">States covered</div></div>
            <div className="stat"><div className="stat-num">$0</div><div className="stat-label">To start</div></div>
          </div>

          <div className="how">
            <h2>How it works</h2>
            <p>Generate professional landlord documents in 3 simple steps</p>
            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>
                <h3>Pick a tool</h3>
                <p>Choose from 12 landlord tools — emails, notices, clauses, checklists and more.</p>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <h3>Fill in details</h3>
                <p>Enter your tenant's name, situation, and any specifics. Takes under a minute.</p>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <h3>Copy or download</h3>
                <p>Get a professional document instantly. Copy to clipboard or download as PDF.</p>
              </div>
            </div>
          </div>

          <div className="tools-section">
            <div className="section-header">
              <h2>Everything a landlord needs</h2>
              <p>Click any tool to try it free</p>
            </div>
            <div className="tools-grid">
              {TOOLS.map(t => (
                <div key={t.id} className="tool-card" onClick={() => { selectTool(t); setView('app') }}>
                  <div className="tool-icon">{t.icon}</div>
                  <div className="tool-name">{t.name}</div>
                  <div className="tool-desc">{t.desc}</div>
                  <div className={`tool-tag ${t.free ? 'free' : 'pro'}`}>{t.free ? 'Free' : 'Pro'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="faq">
            <h2>Frequently asked questions</h2>
            {FAQS.map((f, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-q">{f.q} <span>{openFaq === i ? '−' : '+'}</span></div>
                <div className={`faq-a${openFaq === i ? ' open' : ''}`}>{f.a}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* APP */}
      {view === 'app' && (
        <div className="tools-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ textAlign: 'left', marginBottom: 0, fontSize: 22 }}>AI Tools</h2>
            <span className={`usage-pill ${usagePillClass}`}>
              {usageLeft > 0 ? `${usageLeft} free use${usageLeft !== 1 ? 's' : ''} left` : '⚠️ Limit reached'}
            </span>
          </div>

          <div className="tools-grid">
            {TOOLS.map(t => (
              <div key={t.id} className={`tool-card${activeTool.id === t.id ? ' active' : ''}`} onClick={() => selectTool(t)}>
                <div className="tool-icon">{t.icon}</div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
                <div className={`tool-tag ${t.free ? 'free' : 'pro'}`}>{t.free ? 'Free' : 'Pro'}</div>
              </div>
            ))}
          </div>

          {usageLeft <= 0 ? (
            <div className="paywall">
              <h3>You've used your 3 free generations 🎉</h3>
              <p>Upgrade to Pro for unlimited access to all 12 tools, PDF downloads, and priority AI — for less than a cup of coffee a week.</p>
              <button className="primary" onClick={() => setView('pricing')} style={{ fontSize: 15, padding: '12px 32px' }}>
                Upgrade to Pro — $9/mo →
              </button>
            </div>
          ) : (
            <div className="generator">
              <div className="gen-header">
                <div className="gen-title">{activeTool.icon} {activeTool.name}</div>
              </div>
              {activeTool.fields.map(f => (
                <div className="field-group" key={f.id}>
                  <label>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={fields[f.id] || ''} onChange={e => updateField(f.id, e.target.value)} placeholder={f.placeholder} />
                  ) : f.type === 'select' ? (
                    <select value={fields[f.id] || ''} onChange={e => updateField(f.id, e.target.value)}>
                      <option value="">Select...</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input value={fields[f.id] || ''} onChange={e => updateField(f.id, e.target.value)} placeholder={f.placeholder} />
                  )}
                </div>
              ))}
              <div className="btn-row">
                <button className="primary" onClick={handleGenerate} disabled={loading}>
                  {loading ? <><span className="spinner" />Generating...</> : 'Generate →'}
                </button>
              </div>

              {output && (
                <div className="output-wrap">
                  <div className="output-toolbar">
                    <span className="output-label">✓ Document ready</span>
                    <div className="output-actions">
                      <button onClick={downloadPDF}>⬇ PDF</button>
                      <button onClick={copy}>{copied ? '✓ Copied!' : 'Copy'}</button>
                    </div>
                  </div>
                  <div className="output">{output}</div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 8 }}>⚠️ Review before use. Not legal advice. Consult an attorney for legal matters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PRICING */}
      {view === 'pricing' && (
        <div className="pricing">
          <div className="section-header">
            <h2>Simple, honest pricing</h2>
            <p>Start free. Upgrade when you're ready.</p>
          </div>
          <div className="pricing-grid">
            <div className="plan">
              <div className="plan-name">Free</div>
              <div className="plan-price"><sup>$</sup>0<sub>/mo</sub></div>
              <div className="plan-desc">Try it, no card needed</div>
              <ul className="plan-features">
                <li><span className="check">✓</span> 3 AI generations</li>
                <li><span className="check">✓</span> All 12 tools</li>
                <li><span className="check">✓</span> Copy to clipboard</li>
                <li><span className="cross">✗</span> PDF download</li>
                <li><span className="cross">✗</span> Unlimited use</li>
              </ul>
              <button style={{ width: '100%' }} onClick={() => setView('app')}>Get started free</button>
            </div>
            <div className="plan featured">
              <div className="plan-badge">Most popular</div>
              <div className="plan-name">Pro</div>
              <div className="plan-price"><sup>$</sup>9<sub>/mo</sub></div>
              <div className="plan-desc">For serious landlords</div>
              <ul className="plan-features">
                <li><span className="check">✓</span> Unlimited generations</li>
                <li><span className="check">✓</span> All 12 tools</li>
                <li><span className="check">✓</span> PDF download</li>
                <li><span className="check">✓</span> New tools monthly</li>
                <li><span className="check">✓</span> Email support</li>
              </ul>
              <button className="primary" style={{ width: '100%' }} onClick={() => alert('Stripe payments coming soon! Email ryanhammond@landlordai.app to get early access at $9/mo.')}>
                Upgrade to Pro →
              </button>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, marginTop: '1.5rem' }}>
            No contracts · Cancel anytime · 7-day money back guarantee
          </p>
        </div>
      )}

      <footer>
        <div className="footer-inner">
          <div className="footer-logo">🏠 Landlord<em style={{ color: 'var(--accent2)', fontStyle: 'normal' }}>AI</em></div>
          <div className="footer-links">
            <a onClick={() => setView('pricing')}>Pricing</a>
            <a onClick={() => router.push('/terms')}>Terms</a>
            <a onClick={() => router.push('/privacy')}>Privacy</a>
          </div>
          <div className="footer-copy">© 2026 LandlordAI · Powered by Claude AI</div>
        </div>
      </footer>
    </>
  )
}
