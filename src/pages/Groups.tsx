
import React, { useState } from 'react';
import { Plus, Users, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { useNavigate } from 'react-router-dom';

const Groups: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock data for demonstration
  const userGroups = [
    {
      id: '1',
      name: 'Family Vacation 2024',
      description: 'Planning our summer family trip to the beach',
      memberCount: 6,
      itemCount: 23,
      createdAt: '2024-01-15',
      isCreator: true
    },
    {
      id: '2',
      name: 'Weekend Hiking Trip',
      description: 'Gear and supplies for our mountain adventure',
      memberCount: 4,
      itemCount: 15,
      createdAt: '2024-01-10',
      isCreator: false
    },
    {
      id: '3',
      name: 'Business Conference',
      description: 'Essential items for the upcoming conference',
      memberCount: 3,
      itemCount: 8,
      createdAt: '2024-01-05',
      isCreator: false
    }
  ];

  const filteredGroups = userGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewGroup = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
          <p className="text-gray-600">Manage your travel shopping groups</p>
        </div>
        <CreateGroupDialog>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Group
          </Button>
        </CreateGroupDialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search your groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {group.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {group.description}
                  </CardDescription>
                </div>
                {group.isCreator && (
                  <Badge variant="secondary" className="ml-2">
                    Creator
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{group.memberCount} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{group.itemCount} items</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-blue-50 group-hover:border-blue-200"
                  onClick={() => handleViewGroup(group.id)}
                >
                  View Group
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No groups found' : 'No groups yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first group to start collaborating on shopping lists'
              }
            </p>
            {!searchQuery && (
              <CreateGroupDialog>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Group
                </Button>
              </CreateGroupDialog>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Groups;
