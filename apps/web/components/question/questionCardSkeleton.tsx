import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function QuestionCardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader>
        <Skeleton className="size-2xl rounded-full" />
        <Skeleton className="h-md w-3xl" />
        <Skeleton className="h-md w-2xl" />
      </CardHeader>
      <CardContent className="space-y-xs">
        <Skeleton className="h-xl w-2/3" />
        <Skeleton className="h-lg w-full" />
        <Skeleton className="h-lg w-4/5" />
      </CardContent>
      <CardFooter className="justify-between">
        <Skeleton className="h-md w-3xl" />
        <Skeleton className="h-xl w-3xl rounded-full" />
      </CardFooter>
    </Card>
  );
}
