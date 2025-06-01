
import React, { useState } from 'react';
import { Search, Users, TrendingUp, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const stats = {
    totalJoinedGroups: 5,
    totalLeftGroups: 2,
    createdGroups: ['Family Trip 2024', 'Weekend Getaway']
  };

  const searchResults = [
    {
      id: '1',
      name: 'Beach Vacation 2024',
      creator: 'John Doe',
      createdAt: '2024-01-15',
      memberCount: 6
    },
    {
      id: '2',
      name: 'Mountain Hiking Trip',
      creator: 'Sarah Wilson',
      createdAt: '2024-01-10',
      memberCount: 4
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ShopList</h1>
        <p className="text-xl text-gray-600">Organize your travel shopping with your group</p>
      </div>

      {/* Search Section */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Find Groups</span>
          </CardTitle>
          <CardDescription>
            Search for travel groups to join and collaborate on shopping lists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Joined Groups</p>
                <p className="text-3xl font-bold text-green-700">{stats.totalJoinedGroups}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Left Groups</p>
                <p className="text-3xl font-bold text-orange-700">{stats.totalLeftGroups}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Created Groups</p>
                <p className="text-3xl font-bold text-purple-700">{stats.createdGroups.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Created Groups Section */}
      {stats.createdGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Created Groups</CardTitle>
            <CardDescription>Groups you've created for your travels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.createdGroups.map((group, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{group}</span>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription>
                    Created by {group.creator} • {group.memberCount} members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                    <Button>Join Group</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
