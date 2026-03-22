import { SignUp } from '@clerk/react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SignUp 
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
        afterSignOutUrl="/"
      />
    </div>
  );
}
