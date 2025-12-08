import LoginLayout from './components/LoginLayout';
import LoginForm from './components/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
