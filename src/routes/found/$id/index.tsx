import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/found/$id/')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/profile/$public-code', params: { 'public-code': params.id } })
  },
  component: () => null,
})
