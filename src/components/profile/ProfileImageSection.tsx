
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface ProfileImageSectionProps {
  user: User | null;
  profileImage: string | null;
  setProfileImage: (url: string) => void;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({ user, profileImage, setProfileImage }) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'UN';
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    try {
      setUploadingImage(true);
      const file = event.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem');
        return;
      }
      
      // Check dimensions (using Image API)
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = async () => {
        URL.revokeObjectURL(objectUrl);
        
        // Upload the file
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}.${fileExt}`;
        const filePath = `profile_images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        // Update profile with new image URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            profile_image_url: publicUrl.publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user?.id);
          
        if (updateError) {
          throw updateError;
        }
        
        setProfileImage(publicUrl.publicUrl);
        toast.success('Foto de perfil atualizada com sucesso');
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        toast.error('Arquivo inválido');
        setUploadingImage(false);
      };
      
      img.src = objectUrl;
      
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao atualizar foto de perfil');
    } finally {
      setUploadingImage(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Avatar className="h-32 w-32">
        {profileImage ? (
          <AvatarImage src={profileImage} className="object-cover" alt="Foto de perfil" />
        ) : (
          <AvatarFallback className="text-4xl bg-primary text-white">
            {userInitials}
          </AvatarFallback>
        )}
      </Avatar>
      
      <Button
        variant="outline"
        className="relative w-full max-w-xs"
        disabled={uploadingImage}
      >
        {uploadingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Upload className="mr-2 h-4 w-4" />
        Carregar Nova Foto
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleImageUpload}
          accept="image/*"
          disabled={uploadingImage}
        />
      </Button>
    </div>
  );
};

export default ProfileImageSection;
