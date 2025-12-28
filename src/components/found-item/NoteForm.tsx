import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Send, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface NoteFormProps {
  itemId: string
}

export function NoteForm({ itemId }: NoteFormProps) {
  const navigate = useNavigate()
  const [note, setNote] = useState('')
  const [shareLocation, setShareLocation] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ note, shareLocation })

    // Navigate to success page
    navigate({ to: '/found/$id/success', params: { id: itemId } })
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
        Add a Note for Owner
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Area */}
        <div className="relative">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Hi, I found your backpack at..."
            className="resize-none rounded-2xl min-h-32 border-2 focus:border-blue-300 transition-colors"
            rows={5}
          />
        </div>

        {/* Location Toggle */}
        <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-colors">
          <Switch
            id="share-location"
            checked={shareLocation}
            onCheckedChange={setShareLocation}
          />
          <div className="flex-1">
            <Label
              htmlFor="share-location"
              className="font-semibold text-gray-900 mb-1 cursor-pointer block"
            >
              Share My Current Location with Owner
            </Label>
            <p className="text-sm text-gray-600 leading-relaxed">
              This helps the owner coordinate pickup.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="w-full h-14 rounded-full text-base font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all"
        >
          <Send className="w-5 h-5" />
          Send Note to Owner
        </Button>

        {/* Privacy Message */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-2 bg-gray-50 py-3 px-4 rounded-xl">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Your privacy is our priority.</span>
        </div>
      </form>
    </div>
  )
}
