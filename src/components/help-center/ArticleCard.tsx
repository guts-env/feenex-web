import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ArticleCardProps {
  title: string;
  description: string;
  readTime?: number;
  onClick?: () => void;
}

export function ArticleCard({ title, description, readTime, onClick }: ArticleCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-sm hover:border-primary transition-all flex-shrink-0 w-80 h-32 md:w-auto md:h-32"
      onClick={onClick}
    >
      <CardHeader className="h-full">
        <div className="flex items-start justify-between h-full">
          <div className="flex-1 flex flex-col">
            <CardTitle className="text-base line-clamp-2">{title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2 flex-1">{description}</CardDescription>
          </div>
          {readTime && (
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {readTime} min
            </span>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}