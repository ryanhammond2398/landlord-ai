import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Privacy() {
  const router = useRouter()
  return (
    <>
      <Head><title>Privacy Policy — LandlordAI</title></Head>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div className="logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>🏠 Landlord<em>AI</em></div>
      </nav>
      <div className="legal">
        <h1>Privacy Policy</h1>
        <div className="date">Last updated: June 2026</div>
        <h2>1. Information We Collect</h2>
        <p>We collect:</p>
        <ul>
          <li>Email address (if you sign up for updates)</li>
          <li>Content you enter into our tools to generate documents</li>
          <li>Usage data (pages visited, tools used) via analytics</li>
        </ul>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To generate AI documents based on your inputs</li>
          <li>To send product updates if you opted in</li>
          <li>To improve our service</li>
        </ul>
        <h2>3. AI Processing</h2>
        <p>Text you enter into our tools is sent to Anthropic's Claude AI to generate documents. Please do not enter sensitive personal information such as Social Security numbers or financial account details.</p>
        <h2>4. Data Sharing</h2>
        <p>We do not sell your data. We share data only with service providers necessary to operate LandlordAI (AI processing, hosting, analytics).</p>
        <h2>5. Data Retention</h2>
        <p>We do not store the documents you generate. Email addresses are retained until you unsubscribe.</p>
        <h2>6. Your Rights</h2>
        <p>You may request deletion of your email from our list at any time by emailing support@landlordai.app.</p>
        <h2>7. Contact</h2>
        <p>Questions about privacy? Email support@landlordai.app</p>
      </div>
    </>
  )
}
