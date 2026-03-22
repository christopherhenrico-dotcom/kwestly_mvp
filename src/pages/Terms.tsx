import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '@/components/layout/TopNav';
import { ArrowLeft } from 'lucide-react';

const Terms: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="font-mono text-sm text-muted-foreground">Last updated: March 2024</p>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              By accessing or using Kwestly, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">2. Description of Service</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Kwestly is a peer-to-peer marketplace connecting developers with clients who need 
              code shipped. Users can post quests (tasks), accept quests, and receive payment 
              in USDC upon successful completion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">3. User Accounts</h2>
            <ul className="font-mono text-sm text-muted-foreground space-y-2 list-disc pl-6">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must be at least 18 years old to use the platform</li>
              <li>One account per person unless explicitly permitted</li>
              <li>You agree to indemnify us for any activity under your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">4. Quest Posting and Acceptance</h2>
            <ul className="font-mono text-sm text-muted-foreground space-y-2 list-disc pl-6">
              <li>Quest posters must provide accurate descriptions and deliverables</li>
              <li>Bounties are locked in escrow upon quest acceptance</li>
              <li>Quest workers have the specified time (TTL) to complete work</li>
              <li>Work must meet stated requirements to qualify for payment</li>
              <li>Disputes are resolved through our review process</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">5. Payments and Fees</h2>
            <ul className="font-mono text-sm text-muted-foreground space-y-2 list-disc pl-6">
              <li>Payments are processed in USDC on Base network</li>
              <li>A 10% platform fee is deducted from each successful payment</li>
              <li>Payments are released upon poster approval or dispute resolution</li>
              <li>You are responsible for any taxes on earnings</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">6. Intellectual Property</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Work product delivered through Kwestly quests belongs to the quest poster upon 
              payment. Quest workers retain rights to general knowledge and skills. You must 
              not submit work you do not have rights to.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">7. Prohibited Activities</h2>
            <ul className="font-mono text-sm text-muted-foreground space-y-2 list-disc pl-6">
              <li>Fraudulent or misleading quest postings</li>
              <li>Plagiarism or submitting others' work</li>
              <li>Spam or repetitive low-quality submissions</li>
              <li>Violating any third-party intellectual property rights</li>
              <li>Attempting to circumvent the payment system</li>
              <li>Any illegal activities or money laundering</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">8. Limitation of Liability</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Kwestly is not responsible for work quality disputes, blockchain transaction 
              failures, or losses arising from platform use. Our liability is limited to 
              fees paid to us in the 12 months preceding any claim.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">9. Changes to Terms</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              We may update these terms at any time. Continued use of the platform after 
              changes constitutes acceptance of new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">10. Contact</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Questions about these terms? Contact us at legal@kwestly.pages.dev
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
