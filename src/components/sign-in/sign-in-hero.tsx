import { CharacterIllustration } from '@/components/sign-in/character-illustration'

export function SignInHero() {
  return (
    <div
      className="
        relative overflow-hidden shrink-0
        h-64
        lg:h-auto lg:w-1/2
        lg:flex lg:flex-col lg:justify-center lg:gap-12
        lg:px-20 lg:py-20
      "
    >
      <div className="px-7 pt-10 lg:px-0 lg:pt-0">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-1 tracking-tight">
          Hello!
        </h1>
        <p className="text-gray-500 text-base lg:text-lg">Welcome to Backtrack</p>
      </div>

      <CharacterIllustration />
    </div>
  )
}
