import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '@/components/layout/TopNav';
import { ArrowLeft } from 'lucide-react';

const Privacy: FC = () => {
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

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="font-mono text-sm text-muted-foreground">Last updated: March 2024</p>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">1. Information We Collect</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              We collect information you provide directly, including your name, email address, GitHub username, 
              and wallet address when you create an account. We also collect data about your GitHub activity 
              to calculate your Execution Score, including repository contributions, commit history, and 
              pull request activity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">2. How We Use Your Information</h2>
            <ul className="font-mono text-sm text-muted-foreground space-y-2 list-disc pl-6">
              <li>To provide and maintain the Kwestly platform services</li>
              <li>To calculate and display your Execution Score</li>
              <li>To process payments for completed quests</li>
              <li>To notify you about quest updates and platform announcements</li>
              <li>To improve our services and user experience</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">3. Data Storage and Security</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              We store your data securely using PocketBase as our backend infrastructure. All data is 
              encrypted in transit using HTTPS. Your wallet address and financial information are 
              stored securely and never shared with third parties without your consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">4. Blockchain Data</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Transaction history on the blockchain is public and cannot be deleted. We record payment 
              transactions on Base network for quest completion verification. This data is stored 
              permanently for compliance and verification purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">5. Cookies and Tracking</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              We use essential cookies for authentication and session management. We do not use 
              third-party tracking or advertising cookies. GitHub OAuth is used for authentication 
              and does not share your GitHub data with unauthorized parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">6. Your Rights</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              You have the right to access, update, or delete your personal information at any time 
              through your account settings. You can export your data or request account deletion 
              by contacting us at privacy@kwestly.dev.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">7. Contact Us</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              For privacy-related questions or concerns, contact us at:<br />
              Email: privacy@kwestly.pages.dev<br />
              Address: Kwestly, Inc.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
