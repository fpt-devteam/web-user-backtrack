import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

export function SpinnerDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Spinner Variants
          </h1>
          <p className="text-gray-600">
            Choose from 6 different animated spinner styles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Variant */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Badge className="mb-4">Default</Badge>
            <div className="h-32 flex items-center justify-center mb-4">
              <Spinner variant="default" size="lg" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Classic spinning loader icon
            </p>
            <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
              {`<Spinner variant="default" />`}
            </code>
          </Card>

          {/* Dots Variant */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Badge className="mb-4">Dots</Badge>
            <div className="h-32 flex items-center justify-center mb-4">
              <Spinner variant="dots" size="lg" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Three bouncing dots animation
            </p>
            <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
              {`<Spinner variant="dots" />`}
            </code>
          </Card>

          {/* Pulse Variant */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Badge className="mb-4">Pulse</Badge>
            <div className="h-32 flex items-center justify-center mb-4">
              <Spinner variant="pulse" size="lg" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Pulsing circle with ping effect
            </p>
            <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
              {`<Spinner variant="pulse" />`}
            </code>
          </Card>

          {/* Ring Variant */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Badge className="mb-4">Ring</Badge>
            <div className="h-32 flex items-center justify-center mb-4">
              <Spinner variant="ring" size="lg" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Rotating ring spinner
            </p>
            <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
              {`<Spinner variant="ring" />`}
            </code>
          </Card>

          {/* Bars Variant */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Badge className="mb-4">Bars</Badge>
            <div className="h-32 flex items-center justify-center mb-4">
              <Spinner variant="bars" size="lg" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Four bouncing bars
            </p>
            <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
              {`<Spinner variant="bars" />`}
            </code>
          </Card>

          {/* Orbit Variant */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Badge className="mb-4">Orbit</Badge>
            <div className="h-32 flex items-center justify-center mb-4">
              <Spinner variant="orbit" size="lg" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Orbiting dots around center
            </p>
            <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
              {`<Spinner variant="orbit" />`}
            </code>
          </Card>
        </div>

        {/* Size Examples */}
        <Card className="mt-8 p-8">
          <h2 className="text-2xl font-bold mb-6">Size Options</h2>
          <div className="flex items-end justify-around gap-4">
            <div className="text-center">
              <Spinner variant="dots" size="xs" />
              <p className="text-xs text-gray-500 mt-2">xs</p>
            </div>
            <div className="text-center">
              <Spinner variant="dots" size="sm" />
              <p className="text-xs text-gray-500 mt-2">sm</p>
            </div>
            <div className="text-center">
              <Spinner variant="dots" size="md" />
              <p className="text-xs text-gray-500 mt-2">md</p>
            </div>
            <div className="text-center">
              <Spinner variant="dots" size="lg" />
              <p className="text-xs text-gray-500 mt-2">lg</p>
            </div>
            <div className="text-center">
              <Spinner variant="dots" size="xl" />
              <p className="text-xs text-gray-500 mt-2">xl</p>
            </div>
          </div>
        </Card>

        {/* Color Examples */}
        <Card className="mt-8 p-8">
          <h2 className="text-2xl font-bold mb-6">Color Options</h2>
          <div className="flex items-center justify-around gap-4 flex-wrap">
            <div className="text-center">
              <Spinner variant="ring" size="lg" color="text-blue-600" />
              <p className="text-xs text-gray-500 mt-2">Blue</p>
            </div>
            <div className="text-center">
              <Spinner variant="ring" size="lg" color="text-purple-600" />
              <p className="text-xs text-gray-500 mt-2">Purple</p>
            </div>
            <div className="text-center">
              <Spinner variant="ring" size="lg" color="text-green-600" />
              <p className="text-xs text-gray-500 mt-2">Green</p>
            </div>
            <div className="text-center">
              <Spinner variant="ring" size="lg" color="text-red-600" />
              <p className="text-xs text-gray-500 mt-2">Red</p>
            </div>
            <div className="text-center">
              <Spinner variant="ring" size="lg" color="text-orange-600" />
              <p className="text-xs text-gray-500 mt-2">Orange</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
