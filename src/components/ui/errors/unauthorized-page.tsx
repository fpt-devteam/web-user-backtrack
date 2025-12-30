import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Home, Lock, LogIn } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Lock className="mx-auto h-16 w-16 text-yellow-500" />
          <CardTitle className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            401 - Unauthorized
          </CardTitle>
          <CardDescription className="mt-2 text-base text-gray-500 dark:text-gray-400">
            You need to be logged in to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Please log in to continue. If you don't have an account, you can register for one.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
