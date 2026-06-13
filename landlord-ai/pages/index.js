import { useState } from 'react'
import Head from 'next/head'

const TOOLS = [
  {
    id: 'tenant-email',
    icon: '✉️',
    name: 'Tenant Email Writer',
    desc: 'Professional emails for any tenant situation — late rent, repairs, complaints, lease renewals.',
    fields: [
      { id: 'situation', label: 'What happened?', type: 'textarea', placeholder: 'e.g. Tenant is 2 weeks late on rent and not responding to texts...' },
      { id: 'tone', label: 'Tone', type: 'select', options: ['Professional & firm', 'Friendly reminder', 'Final warning', 'Understanding & flexible'] },
      { id: 'landlordName', label: 'Your name', type: 'input', placeholder: 'John Smith' },
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
    ],
    prompt: (f) => `Write a professional landlord email for this situation: ${f.situation}
Tone: ${f.tone}
From: ${f.landlordName || 'The Landlord'}
To: ${f.tenantName || 'Tenant'}
Write a complete, ready-to-send email. Be clear, professional, and legally appropriate. Do not include any explanation — just the email.`
  },
  {
    id: 'lease-clause',
    icon: '📋',
    name: 'Lease Clause Generator',
    desc: 'Generate airtight lease clauses for pets, parking, utilities, noise, subletting and more.',
    fields: [
      { id: 'topic', label: 'What clause do you need?', type: 'input', placeholder: 'e.g. No smoking, pet policy, parking rules...' },
      { id: 'state', label: 'State / Country', type: 'input', placeholder: 'e.g. Texas, California, UK' },
      { id: 'details', label: 'Any specific details?', type: 'textarea', placeholder: 'e.g. Allow 1 small dog under 25lbs, $500 pet deposit...' },
    ],
    prompt: (f) => `Write a professional lease clause for: ${f.topic}
State/Country: ${f.state || 'General'}
Details: ${f.details || 'Standard terms'}
Write a clear, legally appropriate lease clause ready to add to a rental agreement. Be specific and comprehensive. Just the clause text, no explanation.`
  },
  {
    id: 'listing',
    icon: '🏠',
    name: 'Rental Listing Writer',
    desc: 'Write compelling rental listings that attract quality tenants fast.',
    fields: [
      { id: 'bedrooms', label: 'Bedrooms / Bathrooms', type: 'input', placeholder: 'e.g. 3 bed / 2 bath' },
      { id: 'location', label: 'Location', type: 'input', placeholder: 'e.g. Austin, TX — Hyde Park neighborhood' },
      { id: 'rent', label: 'Monthly rent', type: 'input', placeholder: 'e.g. $1,850/month' },
      { id: 'features', label: 'Key features & amenities', type: 'textarea', placeholder: 'e.g. Updated kitchen, hardwood floors, in-unit laundry, backyard, pet friendly...' },
    ],
    prompt: (f) => `Write an attractive rental listing for this property:
${f.bedrooms} | ${f.location} | ${f.rent}/month
Features: ${f.features}
Write a compelling listing with a catchy headline, engaging description, and bullet points of key features. Make it stand out and attract quality tenants. Ready to post on Zillow/Craigslist.`
  },
  {
    id: 'eviction',
    icon: '⚠️',
    name: 'Late Payment Notice',
    desc: 'Generate formal late payment notices and pay-or-quit letters that hold up legally.',
    fields: [
      { id: 'tenantName', label: "Tenant's full name", type: 'input', placeholder: 'Jane Doe' },
      { id: 'address', label: 'Property address', type: 'input', placeholder: '123 Main St, Austin TX 78701' },
      { id: 'amountDue', label: 'Amount owed', type: 'input', placeholder: 'e.g. $1,850' },
      { id: 'daysLate', label: 'Days past due', type: 'input', placeholder: 'e.g. 14 days' },
      { id: 'state', label: 'State', type: 'input', placeholder: 'e.g. Texas' },
    ],
    prompt: (f) => `Write a formal late rent payment notice letter for:
Tenant: ${f.tenantName}
Property: ${f.address}
Amount due: ${f.amountDue}
Days late: ${f.daysLate}
State: ${f.state}
Write a professional, firm notice that includes the amount owed, deadline to pay, and consequences of non-payment. Appropriate for ${f.state} landlord-tenant law. Just the letter, no explanation.`
  },
  {
    id: 'maintenance',
    icon: '🔧',
    name: 'Maintenance Response',
    desc: 'Reply to maintenance requests professionally and document everything properly.',
    fields: [
      { id: 'issue', label: "Tenant's maintenance request", type: 'textarea', placeholder: 'e.g. Tenant says the kitchen sink is leaking and has been for a week...' },
      { id: 'response', label: 'Your plan', type: 'input', placeholder: 'e.g. Sending plumber Tuesday between 10am-2pm' },
      { id: 'tenantName', label: "Tenant's name", type: 'input', placeholder: 'Jane Doe' },
    ],
    prompt: (f) => `Write a professional landlord response to this maintenance request:
Request: ${f.issue}
My plan: ${f.response}
Tenant: ${f.tenantName || 'Tenant'}
Write a clear, professional response that acknowledges the issue, explains what will happen and when, and documents the communication properly. Just the message, no explanation.`
  },
  {
    id: 'screening',
    icon: '🔍',
    name: 'Tenant Screening Questions',
    desc: 'Generate legal screening questions and application templates to find great tenants.',
    fields: [
      { id: 'propertyType', label: 'Property type', type: 'input', placeholder: 'e.g. 2-bed apartment, single family home' },
      { id: 'concerns', label: 'Any specific concerns?', type: 'textarea', placeholder: 'e.g. Want to make sure tenant has stable income, no prior evictions, good with pets...' },
    ],
    prompt: (f) => `Generate a comprehensive tenant screening questionnaire for: ${f.propertyType}
Concerns: ${f.concerns || 'Standard screening'}
Include questions about income, employment, rental history, references, and lifestyle. Make sure all questions are legal and fair housing compliant. Format as a numbered list ready to use.`
  },
]

export default function Home() {
  const [view, setView] = useState('home') // home | app | pricing
  const [activeTool, setActiveTool] = useState(TOOLS[0])
  const [fields, setFields] = useState({})
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [usageCount, setUsageCount] = useState(0)

  const FREE_LIMIT = 3

  const updateField = (id, val) => setFields(f => ({ ...f, [id]: val }))

  const selectTool = (tool) => {
    setActiveTool(tool)
    setFields({})
    setOutput('')
  }

  const generate = async () => {
    if (usageCount >= FREE_LIMIT) {
      alert('You\'ve used your 3 free generations! Upgrade to Pro for unlimited access — just $19/month.')
      return
    }
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
      setOutput(data.text || 'Something went wrong, please try again.')
      setUsageCount(c => c + 1)
    } catch {
      setOutput('Something went wrong, please try again.')
    }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <title>LandlordAI — AI tools for property managers</title>
        <meta name="description" content="Write tenant emails, lease clauses, rental listings, and eviction notices in seconds with AI. Built for landlords." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav>
        <div className="logo" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
          🏠 <span>Landlord</span>AI
        </div>
        <div className="nav-btns">
          <button onClick={() => setView('pricing')}>Pricing</button>
          <button className="primary" onClick={() => setView('app')}>Try free →</button>
        </div>
      </nav>

      {/* HOME */}
      {view === 'home' && (
        <>
          <div className="hero">
            <div className="badge">✦ Powered by Claude AI</div>
            <h1>Stop dreading<br /><span>landlord paperwork</span></h1>
            <p>Write professional tenant emails, lease clauses, rental listings, and legal notices in seconds. Built for landlords who have better things to do.</p>
            <div className="hero-btns">
              <button className="primary" onClick={() => setView('app')} style={{ fontSize: 16, padding: '12px 28px' }}>
                Try free — no signup →
              </button>
              <button onClick={() => setView('pricing')}>See pricing</button>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-num">6</div>
              <div className="stat-label">AI tools</div>
            </div>
            <div className="stat">
              <div className="stat-num">&lt;30s</div>
              <div className="stat-label">Per document</div>
            </div>
            <div className="stat">
              <div className="stat-num">$0</div>
              <div className="stat-label">To start</div>
            </div>
          </div>

          <div className="tools-section">
            <h2>Everything a landlord needs</h2>
            <p>Click any tool to try it free</p>
            <div className="tools-grid">
              {TOOLS.map(t => (
                <div key={t.id} className="tool-card" onClick={() => { selectTool(t); setView('app') }}>
                  <div className="tool-icon">{t.icon}</div>
                  <div className="tool-name">{t.name}</div>
                  <div className="tool-desc">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* APP */}
      {view === 'app' && (
        <div className="tools-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ textAlign: 'left', marginBottom: 0 }}>AI Tools</h2>
            <span style={{ fontSize: 13, color: usageCount >= FREE_LIMIT ? '#ef4444' : 'var(--text2)' }}>
              {FREE_LIMIT - usageCount > 0 ? `${FREE_LIMIT - usageCount} free uses left` : '⚠️ Upgrade to continue'}
            </span>
          </div>

          <div className="tools-grid">
            {TOOLS.map(t => (
              <div key={t.id} className={`tool-card${activeTool.id === t.id ? ' active' : ''}`} onClick={() => selectTool(t)}>
                <div className="tool-icon">{t.icon}</div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
              </div>
            ))}
          </div>

          <div className="generator">
            <div className="gen-title">{activeTool.icon} {activeTool.name}</div>
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
              <button className="primary" onClick={generate} disabled={loading}>
                {loading ? <><span className="spinner"></span>Generating...</> : 'Generate →'}
              </button>
            </div>

            {output && (
              <>
                <div className="output-header">
                  <span className="output-label">Result</span>
                  <button onClick={copy}>{copied ? '✓ Copied!' : 'Copy'}</button>
                </div>
                <div className="output">{output}</div>
              </>
            )}
          </div>

          {usageCount >= FREE_LIMIT && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>You've used your 3 free generations</p>
              <button className="primary" onClick={() => setView('pricing')} style={{ fontSize: 15, padding: '12px 28px' }}>
                Upgrade to Pro — $19/mo →
              </button>
            </div>
          )}
        </div>
      )}

      {/* PRICING */}
      {view === 'pricing' && (
        <div className="pricing">
          <h2>Simple pricing</h2>
          <p style={{ color: 'var(--text2)', marginBottom: '2rem' }}>Start free. Upgrade when you're ready.</p>
          <div className="pricing-grid">
            <div className="plan">
              <div className="plan-name">Free</div>
              <div className="plan-price">$0 <span>/month</span></div>
              <div className="plan-desc">Try it out, no card needed</div>
              <ul className="plan-features">
                <li>3 AI generations</li>
                <li>All 6 tools</li>
                <li>Copy to clipboard</li>
              </ul>
              <button style={{ width: '100%' }} onClick={() => setView('app')}>Get started free</button>
            </div>
            <div className="plan featured">
              <div className="plan-badge">Most popular</div>
              <div className="plan-name">Pro</div>
              <div className="plan-price">$19 <span>/month</span></div>
              <div className="plan-desc">For serious landlords</div>
              <ul className="plan-features">
                <li>Unlimited generations</li>
                <li>All 6 tools</li>
                <li>Priority AI responses</li>
                <li>New tools every month</li>
                <li>Email support</li>
              </ul>
              <button className="primary" style={{ width: '100%' }} onClick={() => alert('Stripe coming soon! Email landlordai@gmail.com to get early access.')}>
                Upgrade to Pro →
              </button>
            </div>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: '1.5rem' }}>
            No contracts. Cancel anytime. 7-day money back guarantee.
          </p>
        </div>
      )}

      <footer>
        <p>© 2026 LandlordAI · Built with Claude AI · <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setView('pricing')}>Pricing</span></p>
      </footer>
    </>
  )
}
