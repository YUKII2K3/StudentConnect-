import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, Star, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'note' | 'article' | 'video' | 'document';
  subject: string;
  preview: string;
  tags: string[];
  lastAccessed: Date;
  starred: boolean;
  url?: string;
}

const mockKnowledge: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Quantum Physics Fundamentals',
    type: 'note',
    subject: 'Physics',
    preview: 'Key principles of quantum mechanics including wave-particle duality, uncertainty principle...',
    tags: ['quantum', 'physics', 'theory'],
    lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    starred: true
  },
  {
    id: '2',
    title: 'French Revolution Timeline',
    type: 'document',
    subject: 'History',
    preview: 'Comprehensive timeline covering major events from 1789-1799...',
    tags: ['france', 'revolution', 'timeline'],
    lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    starred: false
  },
  {
    id: '3',
    title: 'Calculus Integration Techniques',
    type: 'video',
    subject: 'Mathematics',
    preview: 'Step-by-step guide to various integration methods...',
    tags: ['calculus', 'integration', 'math'],
    lastAccessed: new Date(),
    starred: true,
    url: 'https://example.com/video'
  },
  {
    id: '4',
    title: 'Organic Chemistry Reactions',
    type: 'article',
    subject: 'Chemistry',
    preview: 'Common organic reactions with mechanisms and examples...',
    tags: ['organic', 'chemistry', 'reactions'],
    lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    starred: false
  }
];

export const KnowledgeBaseWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [knowledge] = useState<KnowledgeItem[]>(mockKnowledge);

  const subjects = ['all', ...Array.from(new Set(knowledge.map(item => item.subject)))];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return '📝';
      case 'article': return '📰';
      case 'video': return '🎥';
      case 'document': return '📄';
      default: return '📚';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const filteredKnowledge = knowledge.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const starredItems = knowledge.filter(item => item.starred);
  const recentItems = knowledge.sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime()).slice(0, 3);

  return (
    <Card className="group hover:shadow-royal transition-all duration-300 border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Knowledge Base
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Subject Filter */}
        <div className="flex gap-2 flex-wrap">
          {subjects.map((subject) => (
            <Button
              key={subject}
              variant={selectedSubject === subject ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject(subject)}
              className="text-xs capitalize"
            >
              {subject}
            </Button>
          ))}
        </div>

        {/* Quick Access - Starred & Recent */}
        {!searchTerm && selectedSubject === 'all' && (
          <>
            {/* Starred Items */}
            {starredItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Star className="h-3 w-3" />
                  Starred
                </div>
                <div className="space-y-1">
                  {starredItems.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm">{getTypeIcon(item.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.subject}</div>
                      </div>
                      {item.url && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Items */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Clock className="h-3 w-3" />
                Recent
              </div>
              <div className="space-y-1">
                {recentItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm">{getTypeIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{getTimeAgo(item.lastAccessed)}</div>
                    </div>
                    {item.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Search Results */}
        {(searchTerm || selectedSubject !== 'all') && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {filteredKnowledge.length} results
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredKnowledge.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-border hover:border-primary/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span>{getTypeIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        {item.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        {item.url && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">{item.subject}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {item.preview}
                  </p>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};