import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ArticleCard } from '@/components/features/ArticleCard';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  featured?: boolean;
}

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: number;
  popular?: boolean;
  new?: boolean;
}

const categories: HelpCategory[] = [
  {
    id: 'expenses',
    title: 'Expenses',
    description: 'Create, manage, and verify expenses with ease',
    featured: true,
  },
  {
    id: 'organization',
    title: 'Teams & Organization',
    description: 'Manage your organization, invite members, and set permissions',
  },
];

const popularArticles: HelpArticle[] = [
  {
    id: 'auto-expense',
    title: 'Create Auto Expense',
    category: 'expenses',
    description: 'Upload receipts and let Feenex process them automatically',
    readTime: 3,
    popular: true,
  },
  {
    id: 'manual-expense',
    title: 'Create Manual Expense',
    category: 'expenses',
    description: 'Guide to manually enter expense details step by step',
    readTime: 2,
    popular: true,
  },
  {
    id: 'invite-members',
    title: 'Invite Team Members',
    category: 'organization',
    description: 'Add members to your organization and set their roles',
    readTime: 2,
    popular: true,
  },
  {
    id: 'expense-verification',
    title: 'Verify Expenses',
    category: 'expenses',
    description: 'Learn the expense verification workflow',
    readTime: 4,
    new: true,
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredArticles = popularArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPopularArticles = filteredArticles.filter((a) => a.popular);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasResults = filteredPopularArticles.length > 0;

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold mb-1">Help Center</h1>
        <p className="text-muted-foreground text-sm">
          Find answers and learn how to make the most of Feenex
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 h-10 text-sm w-full md:w-1/2"
        />
      </div>

      {/* FAQ Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-3">Frequently Asked Questions</h2>
        <div className="overflow-x-auto">
          {hasSearchQuery && !hasResults ? (
            <div className="text-left py-2">
              <p className="text-muted-foreground">
                No results found for "{searchQuery}". Try a different search term.
              </p>
            </div>
          ) : (
            <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPopularArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  description={article.description}
                  onClick={() => {
                    navigate(`/help-center/${article.category}/${article.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <ArticleCard
                key={category.id}
                title={category.title}
                description={category.description}
                onClick={() => {
                  navigate(`/help-center/${category.id}`);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Still Need Help Section */}
      <h2 className="text-md mb-3">
        <span className="font-semibold">Still need help?</span>{' '}
        <Link to="/support" className="text-primary hover:underline">
          Contact Support
        </Link>
      </h2>
    </div>
  );
}
