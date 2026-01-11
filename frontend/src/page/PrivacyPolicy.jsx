import { Link } from "react-router-dom";
import { Shield, Mail, Home, ArrowLeft } from "lucide-react";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-focus transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>

        <p className="text-base-content/70 mb-8">
          Last updated: January 11, 2026
        </p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="mb-4">
              Welcome to CodeLoom. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Important Disclaimers Regarding Project Nature and Service Provision</h2>
            <p className="mb-4 text-sm leading-relaxed">
              CodeLoom (hereinafter referred to as "the Service", "the Platform", "we", "us", or "our") is a personal educational and portfolio demonstration project developed and maintained by an individual developer (hereinafter referred to as "the Creator") for the purposes of learning, skill development, and professional demonstration. The Service is not operated as a commercial enterprise, nor is it intended to provide professional-grade services or solutions. Users of the Service (hereinafter referred to as "you", "your", or "User") acknowledge and expressly agree that their use of the Service is subject to the terms, conditions, limitations, and disclaimers set forth herein, without exception or modification.
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              The Service is provided on an "AS-IS" and "WHERE-IS" basis, without warranties, representations, or guarantees of any kind, whether express, implied, statutory, or otherwise, including but not limited to implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, completeness, reliability, availability, or uninterrupted operation. The Creator makes no representation, warranty, or guarantee that the Service will meet your specific requirements, expectations, or needs, or that the Service will operate in an error-free, virus-free, or secure manner, or that any defects, errors, bugs, or issues will be corrected or addressed in a timely manner or at all.
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              You expressly acknowledge, understand, and agree that the Service may be subject to interruptions, suspensions, terminations, modifications, degradations, or discontinuations at any time, with or without prior notice, for any reason or no reason, including but not limited to technical failures, maintenance requirements, infrastructure changes, resource constraints, security concerns, or the Creator's discretion. The Creator reserves the absolute right to modify, suspend, or discontinue any aspect, feature, or functionality of the Service, temporarily or permanently, without incurring any liability or obligation to you or any third party. You further acknowledge and agree that you use the Service entirely at your own risk and discretion, and that the Creator shall bear no responsibility or liability for any consequences, damages, losses, or adverse effects arising from your use of, reliance upon, or inability to use the Service.
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              The Creator explicitly disclaims any obligation to provide support, assistance, maintenance, updates, bug fixes, security patches, or any other form of ongoing service or technical assistance, whether formal or informal. While the Creator may, in their sole discretion, choose to provide support or assistance on an ad-hoc, voluntary, and non-binding basis, no such support shall create any obligation, expectation, or entitlement on your part, and the Creator may discontinue such support at any time without notice or liability. This Service is not designed, intended, or suitable for mission-critical, production, commercial, or high-availability applications, and you acknowledge that reliance on the Service for any such purposes is undertaken entirely at your own risk and without recourse against the Creator.
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              By accessing, using, or continuing to use the Service, you unconditionally and irrevocably acknowledge, accept, and agree to all terms, conditions, limitations, exclusions, and disclaimers set forth in this Privacy Policy and any other applicable documentation, and you expressly waive any and all claims, demands, causes of action, or remedies against the Creator arising from or related to your use of the Service, to the fullest extent permitted by applicable law. If you do not agree with these terms, you must immediately cease all use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">Account Information</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Email address</li>
              <li>Username</li>
              <li>Profile picture (optional)</li>
              <li>Authentication tokens (for Google OAuth)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Problem submissions and code</li>
              <li>Contest participation and scores</li>
              <li>Progress tracking and statistics</li>
              <li>Browser type and version</li>
              <li>Device information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To authenticate your account</li>
              <li>To track your progress and submissions</li>
              <li>To display leaderboards and contest rankings</li>
              <li>To improve our platform and user experience</li>
              <li>To send important service notifications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Storage and Security</h2>
            <p className="mb-4">
              Your data is stored securely using industry-standard practices:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Passwords are hashed using bcrypt</li>
              <li>All connections use HTTPS encryption</li>
              <li>Database access is restricted and monitored</li>
              <li>Regular security audits and updates</li>
              <li>Redis caching for improved performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Google OAuth:</strong> For authentication</li>
              <li><strong>Judge0 API:</strong> For code execution and testing</li>
              <li><strong>Vercel:</strong> For hosting the frontend</li>
              <li><strong>Digital Ocean:</strong> For backend hosting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access your personal data</li>
              <li>Update or correct your information</li>
              <li>Delete your account and associated data</li>
              <li>Export your submission history</li>
              <li>Opt-out of non-essential communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to maintain your session and improve your experience:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Session cookies:</strong> To keep you logged in</li>
              <li><strong>Preference cookies:</strong> To remember your settings (theme, language, etc.)</li>
              <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <p className="mb-4">
              We retain your data as long as your account is active. If you delete your account, 
              we will remove your personal data within 30 days, except where we are required by law 
              to retain it longer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="mb-4">
              CodeLoom is intended for users aged 13 and above. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected information from a 
              child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
            <p className="mb-4">
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                The service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties 
                of any kind, whether express or implied.
              </li>
              <li>
                We make no warranty that the service will meet your requirements, be uninterrupted, 
                timely, secure, or error-free.
              </li>
              <li>
                We disclaim all warranties, including but not limited to warranties of merchantability, 
                fitness for a particular purpose, and non-infringement.
              </li>
              <li>
                Any material downloaded or obtained through the use of the service is done at your own 
                discretion and risk.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability and Indemnification</h2>
            <p className="mb-4 text-sm leading-relaxed">
              To the maximum extent permitted by applicable law, and notwithstanding any other provision of this Privacy Policy or any other agreement, understanding, or communication between you and the Creator, in no event shall the Creator, or any affiliates, partners, contributors, licensors, service providers, employees, agents, officers, directors, or representatives of the Creator (collectively, the "Released Parties"), be liable to you or any third party for any direct, indirect, incidental, special, exemplary, consequential, or punitive damages, losses, costs, expenses, or liabilities of any kind whatsoever, including but not limited to loss of profits, loss of revenue, loss of business opportunities, loss of data, loss of goodwill, business interruption, personal injury, emotional distress, reputational harm, or any other pecuniary or non-pecuniary loss or damage, whether foreseeable or unforeseeable, and regardless of the legal theory upon which such claim is based, including but not limited to contract, tort (including negligence), strict liability, or any other theory, arising out of or in connection with your access to, use of, reliance upon, or inability to access or use the Service, even if the Creator has been advised of, knew of, or should have known of the possibility of such damages.
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              Without limiting the generality of the foregoing, the Released Parties shall not be liable or responsible for any losses, damages, or adverse consequences arising from or related to: (a) any errors, inaccuracies, omissions, defects, bugs, viruses, malware, or other harmful components in the Service; (b) any unauthorized access to, use of, alteration of, or disclosure of your data, content, or information; (c) any interruption, suspension, degradation, or termination of the Service; (d) any loss, corruption, or inaccessibility of data, work product, code submissions, contest results, rankings, scores, or any other information stored on or processed by the Service; (e) any incorrect, inaccurate, incomplete, or misleading results, outputs, or computations generated by the Service, including but not limited to code execution results, test case evaluations, contest rankings, or leaderboard positions; (f) any reliance upon or use of any information, content, feature, or functionality provided by the Service; (g) any acts or omissions of third-party service providers, infrastructure providers, hosting providers, API providers, or other third parties; (h) any network failures, server outages, power failures, internet connectivity issues, or other infrastructure-related problems; or (i) any other matter relating to the Service or your use thereof.
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              You expressly acknowledge and agree that you bear sole and exclusive responsibility for maintaining adequate backups of all important data, code, work product, submissions, and other information, and that you shall not rely upon the Service as the sole repository, storage medium, or backup solution for any such information. You further acknowledge and agree that the Creator has no obligation to back up, preserve, retain, or restore any data, content, or information, and that data loss may occur at any time due to various factors including but not limited to system failures, maintenance operations, migrations, security incidents, or the Creator's discretion.
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              You hereby agree to defend, indemnify, and hold harmless the Released Parties from and against any and all claims, demands, actions, suits, proceedings, investigations, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees and court costs) arising out of or related to: (a) your use of or conduct on the Service; (b) your violation of this Privacy Policy or any applicable laws, regulations, or third-party rights; (c) your data, content, or information submitted to or through the Service; (d) any negligent or willful misconduct on your part; or (e) any third-party claims arising from your use of the Service. This indemnification obligation shall survive the termination of your use of the Service and shall continue in full force and effect thereafter.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Backup and Data Loss</h2>
            <p className="mb-4">
              While we make reasonable efforts to maintain data integrity, we strongly recommend that you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Keep local copies of any important code or submissions</li>
              <li>Do not rely on CodeLoom as the sole repository for your work</li>
              <li>Understand that data may be lost due to service issues, migrations, or maintenance</li>
            </ul>
            <p className="text-sm leading-relaxed">
              Notwithstanding the foregoing measures and recommendations, the Creator expressly disclaims all liability, responsibility, and obligations for any data loss, corruption, inaccessibility, or unavailability, howsoever caused, and you acknowledge and agree that you use the Service with the full knowledge, understanding, and acceptance that your data, content, submissions, work product, and any other information may be permanently lost, corrupted, deleted, or rendered inaccessible at any time, without prior notice, recourse, or compensation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-base-200 p-6 rounded-xl border border-base-300">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a 
                  href="mailto:tejasdherange0099@gmail.com" 
                  className="text-primary hover:text-primary-focus font-semibold"
                >
                  tejasdherange0099@gmail.com
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-base-200 border-t border-base-300 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-base-content/60">
          <p>&copy; 2025 CodeLoom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
