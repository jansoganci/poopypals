import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

import Avatar from './Avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarComponent } from '@shared/schema';

interface AvatarEditorProps {
  userId: number;
}

export default function AvatarEditor({ userId }: AvatarEditorProps) {
  const queryClient = useQueryClient();
  
  // State for the selected components
  const [selectedHead, setSelectedHead] = useState<number>(1);
  const [selectedEyes, setSelectedEyes] = useState<number>(1);
  const [selectedMouth, setSelectedMouth] = useState<number>(1);
  const [selectedAccessory, setSelectedAccessory] = useState<number | null>(null);

  // Get the user's current avatar
  const { data: avatar, isLoading: avatarLoading } = useQuery({
    queryKey: ['/api/users', userId, 'avatar'],
    queryFn: () => apiRequest(`/api/users/${userId}/avatar`),
  });

  // Get avatar components by type
  const { data: headComponents, isLoading: headsLoading } = useQuery({
    queryKey: ['/api/avatar/components', 'head'],
    queryFn: () => apiRequest(`/api/avatar/components/head`),
  });

  const { data: eyesComponents, isLoading: eyesLoading } = useQuery({
    queryKey: ['/api/avatar/components', 'eyes'],
    queryFn: () => apiRequest(`/api/avatar/components/eyes`),
  });

  const { data: mouthComponents, isLoading: mouthsLoading } = useQuery({
    queryKey: ['/api/avatar/components', 'mouth'],
    queryFn: () => apiRequest(`/api/avatar/components/mouth`),
  });

  const { data: accessoryComponents, isLoading: accessoriesLoading } = useQuery({
    queryKey: ['/api/avatar/components', 'accessory'],
    queryFn: () => apiRequest(`/api/avatar/components/accessory`),
  });

  // Get user's unlocked components
  const { data: userComponents, isLoading: userComponentsLoading } = useQuery({
    queryKey: ['/api/users', userId, 'avatar/components'],
    queryFn: () => apiRequest(`/api/users/${userId}/avatar/components`),
  });

  // Set initial values when avatar data is loaded
  useEffect(() => {
    if (avatar) {
      setSelectedHead(avatar.headId || 1);
      setSelectedEyes(avatar.eyesId || 1);
      setSelectedMouth(avatar.mouthId || 1);
      setSelectedAccessory(avatar.accessoryId || null);
    }
  }, [avatar]);

  // Save avatar mutation
  const saveAvatarMutation = useMutation({
    mutationFn: (avatarData: any) => {
      return apiRequest(`/api/users/${userId}/avatar`, 'POST', avatarData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'avatar'] });
    },
  });

  // Handle saving the avatar
  const handleSaveAvatar = () => {
    saveAvatarMutation.mutate({
      headId: selectedHead,
      eyesId: selectedEyes,
      mouthId: selectedMouth,
      accessoryId: selectedAccessory,
    }, {
      onSuccess: () => {
        // Find the DOM element with role="dialog" and its close button
        const dialog = document.querySelector('[role="dialog"]');
        if (dialog) {
          const closeButton = dialog.querySelector('button[aria-label="Close"]');
          if (closeButton) {
            (closeButton as HTMLButtonElement).click();
          }
        }
      }
    });
  };

  // Check if a component is unlocked for the user
  const isUnlocked = (componentId: number) => {
    // Default components are always unlocked
    if (componentId === 1 || componentId === 5 || componentId === 9) return true;
    
    // If we don't have user components yet, assume it's locked
    if (!userComponents) return false;
    
    // Check if the component is in the user's unlocked components
    return userComponents.some((c: any) => c.componentId === componentId);
  };

  // Loading state
  const isLoading = avatarLoading || headsLoading || eyesLoading || mouthsLoading || accessoriesLoading || userComponentsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
        <p className="text-sm text-gray-500">Loading avatar editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 pb-6">
      <h2 className="text-xl font-bold">Customize Your Avatar</h2>
      
      {/* Avatar preview */}
      <div className="relative">
        <Avatar
          headId={selectedHead}
          eyesId={selectedEyes}
          mouthId={selectedMouth}
          accessoryId={selectedAccessory}
          size="lg"
        />
      </div>
      
      {/* Component selector tabs */}
      <Tabs defaultValue="head" className="w-full max-w-md">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="head">Head</TabsTrigger>
          <TabsTrigger value="eyes">Eyes</TabsTrigger>
          <TabsTrigger value="mouth">Mouth</TabsTrigger>
          <TabsTrigger value="accessory">Accessories</TabsTrigger>
        </TabsList>
        
        {/* Head components */}
        <TabsContent value="head" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {headComponents?.map((component: AvatarComponent) => (
              <div
                key={component.id}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  selectedHead === component.id ? 'bg-amber-100 ring-2 ring-amber-500 dark:bg-amber-800' : 'bg-gray-100 dark:bg-gray-800'
                } ${!isUnlocked(component.id) && component.id !== 1 ? 'opacity-50' : ''}`}
                onClick={() => isUnlocked(component.id) || component.id === 1 ? setSelectedHead(component.id) : null}
              >
                <div className="relative">
                  <Avatar headId={component.id} size="sm" />
                  {!isUnlocked(component.id) && component.id !== 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">🔒</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Eyes components */}
        <TabsContent value="eyes" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {eyesComponents?.map((component: AvatarComponent) => (
              <div
                key={component.id}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  selectedEyes === component.id ? 'bg-amber-100 ring-2 ring-amber-500 dark:bg-amber-800' : 'bg-gray-100 dark:bg-gray-800'
                } ${!isUnlocked(component.id) && component.id !== 1 ? 'opacity-50' : ''}`}
                onClick={() => isUnlocked(component.id) || component.id === 1 ? setSelectedEyes(component.id) : null}
              >
                <div className="relative">
                  <Avatar eyesId={component.id} size="sm" />
                  {!isUnlocked(component.id) && component.id !== 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">🔒</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Mouth components */}
        <TabsContent value="mouth" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mouthComponents?.map((component: AvatarComponent) => (
              <div
                key={component.id}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  selectedMouth === component.id ? 'bg-amber-100 ring-2 ring-amber-500 dark:bg-amber-800' : 'bg-gray-100 dark:bg-gray-800'
                } ${!isUnlocked(component.id) && component.id !== 1 ? 'opacity-50' : ''}`}
                onClick={() => isUnlocked(component.id) || component.id === 1 ? setSelectedMouth(component.id) : null}
              >
                <div className="relative">
                  <Avatar mouthId={component.id} size="sm" />
                  {!isUnlocked(component.id) && component.id !== 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">🔒</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Accessory components */}
        <TabsContent value="accessory" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                selectedAccessory === null ? 'bg-amber-100 ring-2 ring-amber-500 dark:bg-amber-800' : 'bg-gray-100 dark:bg-gray-800'
              }`}
              onClick={() => setSelectedAccessory(null)}
            >
              <div className="flex items-center justify-center h-16">
                <span>None</span>
              </div>
            </div>
            {accessoryComponents?.map((component: AvatarComponent) => (
              <div
                key={component.id}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  selectedAccessory === component.id ? 'bg-amber-100 ring-2 ring-amber-500 dark:bg-amber-800' : 'bg-gray-100 dark:bg-gray-800'
                } ${!isUnlocked(component.id) ? 'opacity-50' : ''}`}
                onClick={() => isUnlocked(component.id) ? setSelectedAccessory(component.id) : null}
              >
                <div className="relative">
                  <Avatar accessoryId={component.id} size="sm" />
                  {!isUnlocked(component.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">🔒</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Save button */}
      <Button 
        onClick={handleSaveAvatar} 
        className="w-full max-w-xs"
        disabled={saveAvatarMutation.isPending}
      >
        {saveAvatarMutation.isPending ? 'Saving...' : 'Save Avatar'}
      </Button>
    </div>
  );
}