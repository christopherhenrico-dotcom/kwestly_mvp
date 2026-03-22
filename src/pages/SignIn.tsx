import { SignIn } from '@clerk/react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SignIn />
    </div>
  );
}
