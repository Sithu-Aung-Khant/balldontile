import LoginForm from '@/components/login-form';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4 sm:p-24'>
      <div className='w-full max-w-md'>
        <h1 className='text-3xl font-bold mb-8 text-center'>
          Basketball Team Management
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
