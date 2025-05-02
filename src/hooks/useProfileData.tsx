
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Digite um e-mail válido').optional(),
  address: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial'),
  confirmPassword: z.string().min(1, 'Confirme sua nova senha'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;

export const useProfileData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      address: '',
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  useEffect(() => {
    // Evitar múltiplas chamadas e verificar se o usuário está definido
    if (user) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [user?.id]);
  
  // Function to update the profile image
  const setProfileImageAndCache = (url: string) => {
    setProfileImage(url);
  };
  
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      // Verificando se o usuário está definido
      if (!user?.id) {
        setFetchError('ID do usuário não encontrado');
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Erro ao buscar dados do perfil:', error);
        setFetchError('Erro ao buscar dados do perfil');
        setLoading(false);
        return;
      }
      
      if (data) {
        // Acessando com segurança campos que podem não existir
        const firstName = data.first_name || '';
        const lastName = data.last_name || '';
        const email = data.email || user.email || '';
        
        // Verificar se o campo address existe em data
        const address = 'address' in data ? data.address || '' : '';
        
        profileForm.reset({
          firstName,
          lastName,
          email,
          address,
        });
        
        // Verificar se o campo profile_image_url existe em data
        if ('profile_image_url' in data && data.profile_image_url) {
          setProfileImage(data.profile_image_url);
        } else {
          setProfileImage(null);
        }
      }
    } catch (error: any) {
      console.error('Erro ao buscar dados do perfil:', error);
      setFetchError('Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };
  
  // Set up real-time subscription for profile updates
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user.id}`
        }, 
        (payload) => {
          if (payload.new && 'profile_image_url' in payload.new) {
            const newImageUrl = payload.new.profile_image_url as string | null;
            setProfileImage(newImageUrl);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  
  return {
    user,
    loading,
    profileImage,
    setProfileImage: setProfileImageAndCache,
    fetchError,
    profileForm,
    passwordForm,
    fetchProfileData,
  };
};
