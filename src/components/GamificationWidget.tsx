import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Star, 
  Zap, 
  Trophy, 
  Crown, 
  Target,
  TrendingUp,
  Flame,
  Medal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Badge_ {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  timestamp: string;
}

const badges: Badge_[] = [
  { id: '1', name: 'Task Master', description: 'Complete 10 tasks', icon: Trophy, unlocked: true, rarity: 'common' },
  { id: '2', name: 'Study Streak', description: '7 day study streak', icon: Flame, unlocked: true, rarity: 'rare' },
  { id: '3', name: 'Early Bird', description: 'Study before 8 AM', icon: Crown, unlocked: false, rarity: 'epic' },
  { id: '4', name: 'Night Owl', description: 'Study after 10 PM', icon: Star, unlocked: true, rarity: 'common' },
  { id: '5', name: 'Perfect Week', description: 'Complete all tasks for a week', icon: Medal, unlocked: false, rarity: 'legendary' }
];

const recentAchievements: Achievement[] = [
  { id: '1', title: 'Task Completed', description: 'Finished "Math homework"', points: 10, timestamp: '2 hours ago' },
  { id: '2', title: 'Study Session', description: 'Studied for 2 hours', points: 25, timestamp: '1 day ago' },
  { id: '3', title: 'Note Created', description: 'Added detailed chemistry notes', points: 5, timestamp: '2 days ago' }
];

export const GamificationWidget: React.FC = () => {
  const [currentXP, setCurrentXP] = useState(1250);
  const [currentLevel, setCurrentLevel] = useState(8);
  const [xpToNextLevel] = useState(1500);
  const [showXPGain, setShowXPGain] = useState(false);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<Badge_ | null>(null);

  // Simulate XP gain
  const gainXP = (amount: number) => {
    setCurrentXP(prev => prev + amount);
    setShowXPGain(true);
    setTimeout(() => setShowXPGain(false), 2000);
    
    // Check for new badge unlock
    const unlockedBadges = badges.filter(b => b.unlocked);
    if (unlockedBadges.length < badges.length && Math.random() > 0.7) {
      const availableBadge = badges.find(b => !b.unlocked);
      if (availableBadge) {
        setNewBadgeUnlocked(availableBadge);
        setTimeout(() => setNewBadgeUnlocked(null), 4000);
      }
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-muted-foreground bg-muted/20';
      case 'rare': return 'border-primary bg-primary/10';
      case 'epic': return 'border-secondary bg-secondary/10';
      case 'legendary': return 'border-warning bg-warning/10';
      default: return 'border-muted-foreground';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-[0_0_15px_hsl(var(--primary)/0.3)]';
      case 'epic': return 'shadow-[0_0_15px_hsl(var(--secondary)/0.3)]';
      case 'legendary': return 'shadow-[0_0_20px_hsl(var(--warning)/0.4)]';
      default: return '';
    }
  };

  const progressPercentage = (currentXP / xpToNextLevel) * 100;

  return (
    <>
      <Card className="shadow-card border-border hover:shadow-elegant transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-full blur-xl"></div>
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="h-5 w-5 text-primary" />
            </motion.div>
            Student Achievements
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Level {currentLevel}
            </Badge>
          </CardTitle>
          <CardDescription>Track your academic progress and earn rewards</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* XP Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Experience Points</span>
              <span className="text-sm text-muted-foreground">{currentXP} / {xpToNextLevel} XP</span>
            </div>
            
            <div className="relative">
              <Progress value={progressPercentage} className="h-3" />
              <AnimatePresence>
                {showXPGain && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -20, scale: 1 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="absolute -top-8 right-0 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium"
                  >
                    +10 XP
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {xpToNextLevel - currentXP} XP to Level {currentLevel + 1}
            </p>
          </div>

          {/* Badge Collection */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-secondary" />
              Badge Collection
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer
                    ${badge.unlocked 
                      ? `${getRarityColor(badge.rarity)} ${getRarityGlow(badge.rarity)}` 
                      : 'border-muted bg-muted/10 opacity-50'
                    }
                  `}
                  title={badge.unlocked ? badge.description : 'Locked'}
                >
                  <badge.icon className={`h-6 w-6 mx-auto ${
                    badge.unlocked ? 'text-foreground' : 'text-muted-foreground'
                  }`} />
                  {badge.unlocked && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-background"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {recentAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">+{achievement.points}</p>
                    <p className="text-xs text-muted-foreground">{achievement.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => gainXP(10)}
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow"
          >
            <Target className="h-4 w-4 mr-2" />
            Complete a Task (+10 XP)
          </Button>
        </CardContent>
      </Card>

      {/* Badge Unlock Modal */}
      <AnimatePresence>
        {newBadgeUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-8 text-center max-w-sm mx-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <newBadgeUnlocked.icon className="h-16 w-16 mx-auto text-primary mb-4" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">Badge Unlocked!</h3>
              <h4 className="text-lg font-semibold text-primary mb-2">{newBadgeUnlocked.name}</h4>
              <p className="text-muted-foreground mb-4">{newBadgeUnlocked.description}</p>
              
              <Badge className={getRarityColor(newBadgeUnlocked.rarity)}>
                {newBadgeUnlocked.rarity.toUpperCase()}
              </Badge>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mt-4"
              >
                <Button
                  onClick={() => setNewBadgeUnlocked(null)}
                  className="bg-gradient-primary text-primary-foreground"
                >
                  Awesome!
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};