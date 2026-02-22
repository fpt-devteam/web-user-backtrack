import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Search, ArrowLeft, MapPin } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-50 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100 opacity-50 blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100 opacity-30 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 py-12 max-w-2xl mx-auto text-center">
        {/* 404 Badge */}
        <Badge
          variant="outline"
          className="mb-6 px-4 py-2 text-sm font-semibold border-2 border-blue-200 bg-white/80 backdrop-blur-sm"
        >
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          Lost in Space
        </Badge>

        {/* Large 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Main card */}
        <Card className="p-8 mb-8 backdrop-blur-sm bg-white/90 border-2 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                Oops! You're Lost
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                The page you're looking for seems to have wandered off.
                Don't worry, we'll help you find your way back!
              </p>
            </div>

            {/* Illustration placeholder */}
            <div className="py-8">
              <div className="relative mx-auto w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-gradient-to-tl from-purple-100 to-pink-100 rounded-full animate-pulse delay-300" />
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Search className="w-20 h-20 text-gray-300 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-full"
              >
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Homepage
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-2 hover:bg-gray-50 transition-all rounded-full"
              >
                <Link to="/" onClick={() => window.history.back()}>
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Go Back
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Help text */}
        <p className="text-sm text-gray-500 font-medium">
          Need help? Check if the URL is correct or try searching from the homepage.
        </p>
      </div>
    </div>
  );
}
