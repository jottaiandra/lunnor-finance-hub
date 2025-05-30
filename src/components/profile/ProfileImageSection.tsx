
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
  const [previewImage, setPreviewImage] = useState<string | null>(profileImage);
  
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
      
      // Verify supported format
      const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
      if (!supportedFormats.includes(file.type)) {
        toast.error('Formato não suportado. Use JPG, PNG ou WEBP');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setPreviewImage(result);
        }
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;
      
      // Check if avatars bucket exists, attempt to create it if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars');
      
      if (!avatarBucket) {
        // If bucket doesn't exist, inform the user there's a configuration issue
        toast.error('Erro de configuração: Bucket de avatares não encontrado');
        setUploadingImage(false);
        return;
      }
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setProfileImage(publicUrlData.publicUrl);
      toast.success('Foto de perfil atualizada com sucesso');
      
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao atualizar foto de perfil');
      // Restore original image if upload fails
      setPreviewImage(profileImage);
    } finally {
      setUploadingImage(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Avatar className="h-32 w-32">
        {previewImage ? (
          <AvatarImage 
            src={previewImage} 
            className="object-cover" 
            alt="Foto de perfil" 
            onError={() => {
              console.log('Error loading profile image');
              // Fall back to initials if image fails to load
              setPreviewImage(null);
            }}
          />
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
        {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        Carregar Nova Foto
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleImageUpload}
          accept="image/jpeg,image/png,image/webp"
          disabled={uploadingImage}
        />
      </Button>
    </div>
  );
};

export default ProfileImageSection;
