import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/found/$id/')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/profile/$publicCode', params: { publicCode: params.id } })
  },
  component: () => null,
})
