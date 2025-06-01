
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Plus, CheckCircle2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GroupDetails: React.FC = () => {
  const { groupId } = useParams();

  // Mock data for demonstration
  const groupData = {
    id: groupId,
    name: 'Family Vacation 2024',
    description: 'Planning our summer family trip to the beach',
    memberCount: 6,
    itemCount: 23,
    createdAt: '2024-01-15',
    isCreator: true,
    members: [
      { id: '1', name: 'John Doe', username: 'john_doe', isCreator: true },
      { id: '2', name: 'Jane Smith', username: 'jane_smith', isCreator: false },
      { id: '3', name: 'Mike Johnson', username: 'mike_j', isCreator: false }
    ],
    items: [
      { id: '1', name: 'Sunscreen', addedBy: 'John Doe', completed: false },
      { id: '2', name: 'Beach towels', addedBy: 'Jane Smith', completed: true },
      { id: '3', name: 'Swimming goggles', addedBy: 'Mike Johnson', completed: false }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/groups">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{groupData.name}</h1>
          <p className="text-gray-600">{groupData.description}</p>
        </div>
        {groupData.isCreator && (
          <Button>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Group
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shopping List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shopping List</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <CardDescription>
                {groupData.itemCount} items in the list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupData.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 
                        className={`w-5 h-5 ${item.completed ? 'text-green-600' : 'text-gray-300'}`}
                      />
                      <div>
                        <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.name}
                        </span>
                        <p className="text-sm text-gray-500">Added by {item.addedBy}</p>
                      </div>
                    </div>
                    {item.completed && (
                      <Badge variant="secondary" className="text-green-600">
                        Completed
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Group Info */}
        <div className="space-y-6">
          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Members ({groupData.memberCount})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupData.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">@{member.username}</p>
                    </div>
                    {member.isCreator && (
                      <Badge variant="secondary">Creator</Badge>
                    )}
                  </div>
                ))}
              </div>
              {groupData.isCreator && (
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Members
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Group Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Group Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{groupData.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium">
                  {groupData.items.filter(item => item.completed).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(groupData.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
