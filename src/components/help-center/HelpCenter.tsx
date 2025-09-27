import { useState } from 'react';
import {
  Search,
  ChevronRight,
  Book,
  FileText,
  Building2,
  CreditCard,
  Settings,
  Users,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseGuides } from './ExpenseGuides';
import { OrganizationGuides } from './OrganizationGuides';
import { SubscriptionGuides } from './SubscriptionGuides';
import { GettingStartedGuide } from './GettingStartedGuide';
import { OnboardingTestPanel } from './OnboardingTestPanel';
import { OnboardingChecklist } from './OnboardingChecklist';
import { Link } from 'react-router-dom';
import { ArticleCard } from './ArticleCard';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  articles: number;
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
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of Feenex and get up and running quickly',
    icon: Book,
    articles: 5,
    featured: true,
  },
  {
    id: 'expenses',
    title: 'Expenses',
    description: 'Create, manage, and verify expenses with ease',
    icon: FileText,
    articles: 12,
    featured: true,
  },
  {
    id: 'organization',
    title: 'Teams & Organization',
    description: 'Manage your organization, invite members, and set permissions',
    icon: Building2,
    articles: 8,
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    description: 'Track and manage your recurring subscriptions',
    icon: CreditCard,
    articles: 6,
  },
  // {
  //   id: 'settings',
  //   title: 'Settings & Profile',
  //   description: 'Configure your account and preferences',
  //   icon: Settings,
  //   articles: 4,
  // },
  {
    id: 'roles',
    title: 'Roles & Permissions',
    description: 'Understanding user roles and what each role can do',
    icon: Users,
    articles: 3,
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  const filteredArticles = popularArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (selectedArticle) {
    return (
      <div className="flex flex-col items-start">
        <Button
          variant="link"
          onClick={() => {
            setSelectedArticle(null);
            setSelectedGuideId(null);
          }}
          className="mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Help Center
        </Button>

        {selectedArticle === 'expenses' && <ExpenseGuides initialGuideId={selectedGuideId} />}
        {selectedArticle === 'organization' && (
          <OrganizationGuides initialGuideId={selectedGuideId} />
        )}
        {selectedArticle === 'subscriptions' && <SubscriptionGuides />}
        {selectedArticle === 'getting-started' && <GettingStartedGuide />}
        {!['expenses', 'organization', 'subscriptions', 'getting-started'].includes(
          selectedArticle,
        ) && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Guide Content Coming Soon</h3>
            <p className="text-muted-foreground">This guide is currently being developed.</p>
          </div>
        )}
      </div>
    );
  }

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
          <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredArticles
              .filter((a) => a.popular)
              .map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  description={article.description}
                  onClick={() => {
                    setSelectedArticle(article.category);
                    setSelectedGuideId(article.id);
                  }}
                />
              ))}
          </div>
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
                  setSelectedArticle(category.id);
                  setSelectedGuideId(null);
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

      {/* <OnboardingChecklist />

      <OnboardingTestPanel /> */}
    </div>
  );
}
