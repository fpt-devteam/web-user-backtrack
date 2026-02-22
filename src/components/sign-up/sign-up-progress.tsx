interface SignUpProgressProps {
  currentStep: number // 1-based
  totalSteps: number
}

export function SignUpProgress({ currentStep, totalSteps }: Readonly<SignUpProgressProps>) {
  return (
    <div className="flex items-center gap-1.5 flex-1">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i < currentStep ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}
