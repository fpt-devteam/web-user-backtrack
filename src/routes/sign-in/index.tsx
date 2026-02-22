import { createFileRoute } from '@tanstack/react-router'
import { SignInHero } from '@/components/sign-in/sign-in-hero'
import { SignInForm } from '@/components/sign-in/sign-in-form'

export const Route = createFileRoute('/sign-in/')({
  component: SignInPage,
})

function SignInPage() {

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      <SignInHero />
      <div
        className="
          bg-white rounded-t-[2.5rem] -mt-6 relative z-10 flex-1
          lg:mt-0 lg:rounded-none
          lg:w-1/2 lg:flex lg:items-center lg:justify-center
        "
      >
        <div className="w-full px-7 pt-10 pb-14 lg:max-w-md lg:px-0 lg:py-0">
          <SignInForm />
        </div>
      </div>

    </div>
  )
}
