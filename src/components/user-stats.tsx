'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Leaf, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Award,
  Target,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { getUserStats, getUserRecyclingHistory } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/firebase/auth';
import { LoadingSpinner } from './LoadingSpinner';

interface UserStatsProps {
  className?: string;
}

export function UserStats({ className }: UserStatsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const userStats = await getUserStats(user!.uid);
      setStats(userStats);
    } catch (err) {
      console.error('Failed to load user stats:', err);
      setError('Failed to load your recycling statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 15) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    return 'text-gray-600';
  };

  const getAchievementBadge = (totalDevices: number) => {
    if (totalDevices >= 100) return { name: 'Recycling Master', color: 'bg-purple-100 text-purple-800' };
    if (totalDevices >= 50) return { name: 'Eco Warrior', color: 'bg-blue-100 text-blue-800' };
    if (totalDevices >= 25) return { name: 'Green Champion', color: 'bg-green-100 text-green-800' };
    if (totalDevices >= 10) return { name: 'Recycling Rookie', color: 'bg-yellow-100 text-yellow-800' };
    return { name: 'Getting Started', color: 'bg-gray-100 text-gray-800' };
  };

  const formatCO2 = (co2: number) => {
    if (co2 >= 1000) return `${(co2 / 1000).toFixed(1)} tons`;
    return `${co2.toFixed(1)} kg`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <LoadingSpinner text="Loading your stats..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No recycling data available yet.</p>
            <p className="text-sm text-gray-500 mt-2">Start recycling devices to see your statistics!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const achievement = getAchievementBadge(stats.totalDevices);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Achievement Badge */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <CardTitle className="text-xl font-bold text-gray-900">Your Achievement</CardTitle>
          </div>
          <Badge className={`text-sm font-medium ${achievement.color}`}>
            {achievement.name}
          </Badge>
        </CardHeader>
      </Card>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Devices Recycled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalDevices}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
                <p className="text-2xl font-bold text-green-600">{formatCO2(stats.totalCO2Saved)}</p>
              </div>
              <Leaf className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materials Value</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalMaterialsValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Average</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageDevicesPerMonth.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recycling Trends
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Device Types
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals & Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Last 30 Days Activity</CardTitle>
              <CardDescription>Your recycling activity over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recyclingTrend.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {stats.recyclingTrend.slice(-7).map((day: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="h-16 bg-gray-100 rounded-lg flex items-end justify-center p-1">
                          {day.count > 0 && (
                            <div 
                              className="bg-blue-500 rounded w-full"
                              style={{ height: `${Math.max(day.count * 20, 4)}px` }}
                            />
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{day.count}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Total devices recycled this month: {stats.recyclingTrend.reduce((sum: number, day: any) => sum + day.count, 0)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recycling activity in the last 30 days</p>
                  <p className="text-sm">Start recycling to see your trends!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Most Recycled Device Types</CardTitle>
              <CardDescription>Your recycling history by device category</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.topDeviceTypes.length > 0 ? (
                <div className="space-y-4">
                  {stats.topDeviceTypes.map((device: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{device.type}</p>
                          <p className="text-sm text-gray-500">{device.count} devices</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(device.count / stats.totalDevices) * 100} 
                          className="w-20 h-2"
                        />
                        <span className="text-sm font-medium text-gray-600">
                          {((device.count / stats.totalDevices) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No device type data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Recycling Goals</CardTitle>
              <CardDescription>Track your progress towards environmental goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CO2 Goal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">CO₂ Reduction Goal</span>
                  <span className="text-sm text-gray-600">
                    {formatCO2(stats.totalCO2Saved)} / 1 ton
                  </span>
                </div>
                <Progress 
                  value={Math.min((stats.totalCO2Saved / 1000) * 100, 100)} 
                  className="h-3"
                />
                <p className="text-xs text-gray-500">
                  {stats.totalCO2Saved >= 1000 
                    ? "🎉 Goal achieved! You've saved over 1 ton of CO₂"
                    : `${(1000 - stats.totalCO2Saved).toFixed(1)} kg more to reach 1 ton`
                  }
                </p>
              </div>

              <Separator />

              {/* Device Goal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Device Recycling Goal</span>
                  <span className="text-sm text-gray-600">
                    {stats.totalDevices} / 50 devices
                  </span>
                </div>
                <Progress 
                  value={Math.min((stats.totalDevices / 50) * 100, 100)} 
                  className="h-3"
                />
                <p className="text-xs text-gray-500">
                  {stats.totalDevices >= 50 
                    ? "🎉 Goal achieved! You've recycled 50+ devices"
                    : `${50 - stats.totalDevices} more devices to reach 50`
                  }
                </p>
              </div>

              <Separator />

              {/* Monthly Streak */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Monthly Recycling Streak</span>
                  <span className={`text-sm font-medium ${getStreakColor(stats.averageDevicesPerMonth)}`}>
                    {stats.averageDevicesPerMonth.toFixed(1)} devices/month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-gray-500">
                    {stats.averageDevicesPerMonth >= 5 
                      ? "Excellent! You're recycling regularly"
                      : "Keep up the good work! Try to recycle at least 5 devices per month"
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 