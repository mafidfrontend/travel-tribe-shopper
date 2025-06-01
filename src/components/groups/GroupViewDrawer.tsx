
import React from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Settings } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  itemCount: number;
  createdAt: string;
  isCreator: boolean;
}

interface GroupViewDrawerProps {
  group: Group;
  children: React.ReactNode;
}

export const GroupViewDrawer: React.FC<GroupViewDrawerProps> = ({ group, children }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-between">
              {group.name}
              {group.isCreator && (
                <Badge variant="secondary">Creator</Badge>
              )}
            </DrawerTitle>
            <DrawerDescription>
              {group.description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{group.memberCount} members</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{group.itemCount} items in list</span>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button className="w-full" onClick={() => window.location.href = `/groups/${group.id}`}>
                  View Full Details
                </Button>
                
                {group.isCreator && (
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Group Settings
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
