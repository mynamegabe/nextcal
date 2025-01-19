import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalityQuiz from '../../components/PersonalityQuiz';

export const Route = createFileRoute('/_layout/user')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen w-full bg-muted overflow-y-auto">
      <div className="container mx-auto pb-6 pt-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="w-full border bg-card shadow-lg">
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="text-2xl md:text-xl sm:text-lg font-semibold text-foreground">
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 bg-background/50">
              <h2 className="text-lg md:text-base font-medium text-foreground">
                Complete Your Personality Profile
              </h2>
              <p className="text-muted-foreground text-sm md:text-xs">
                Take this quiz to get personalized activity recommendations.
              </p>
            </CardContent>
          </Card>
          
          <div className="w-full pb-6">
            <PersonalityQuiz />
          </div>
        </div>
      </div>
    </div>
  );
}