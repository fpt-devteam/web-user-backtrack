import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Home, ServerCrash } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function InternalServerErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ServerCrash className="mx-auto h-16 w-16 text-red-500" />
          <CardTitle className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            500 - Internal Server Error
          </CardTitle>
          <CardDescription className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Sorry, something went wrong on our end.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            We are working to fix the problem. Please try again later.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
