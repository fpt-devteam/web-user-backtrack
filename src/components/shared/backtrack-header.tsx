import { useNavigate } from '@tanstack/react-router';

export function BacktrackHeader() {
  const navigate = useNavigate();

  return (
    <header className="py-6 px-6 text-center shadow-sm bg-white">
      <button
        className="text-2xl font-bold text-gray-900 cursor-pointer bg-transparent border-0 p-0"
        onClick={() => navigate({ to: '/' })}
      >
        Backtrack
      </button>
    </header>
  )
}