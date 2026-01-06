import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface ImageAsset {
  url: string;
  name: string;
  fullPath: string;
}

export function useImageSystem(folderPath: 'instagram' | 'youtube' | 'soundcloud' | 'studio') {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Logic
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // List all files in the folder
      const { data, error: listError } = await supabase
        .storage
        .from('images') // We assume a bucket named 'images'
        .list(folderPath, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (listError) throw listError;

      if (!data) {
         setImages([]);
         return;
      }

      // Generate public URLs for each file
      const resolvedImages = data.map(file => {
         const { data: { publicUrl } } = supabase
            .storage
            .from('images')
            .getPublicUrl(`${folderPath}/${file.name}`);
         
         // Add timestamp to force browser refresh
         const bust = file.updated_at ? new Date(file.updated_at).getTime() : Date.now();
         
         return {
            url: `${publicUrl}?t=${bust}`,
            name: file.name,
            fullPath: `${folderPath}/${file.name}`
         };
      });

      setImages(resolvedImages);
    } catch (err: unknown) {
      console.error("Error fetching images:", err);
      // Friendly error message for missing keys/bucket
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes('Auth') || errorMessage.includes('Key')) {
          setError("Supabase Keys Missing");
      } else {
          setError(errorMessage || "System Offline");
      }
    } finally {
      setLoading(false);
    }
  }, [folderPath]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Upload Logic
  const uploadImage = async (file: File, customName?: string) => {
     try {
        const fileName = customName || file.name;
        const filePath = `${folderPath}/${fileName}`;
        
        // 1. Upload
        const { error } = await supabase
           .storage
           .from('images')
           .upload(filePath, file, {
              cacheControl: '0', // Disable cache for instant updates
              upsert: true
           });

        if (error) throw error;
        
        // 2. Refresh list
        await fetchImages(); 

        // 3. Return Public URL
        const { data: { publicUrl } } = supabase
           .storage
           .from('images')
           .getPublicUrl(filePath);
           
        // Add cache buster
        return `${publicUrl}?t=${Date.now()}`;
     } catch (err) {
        console.error("Upload failed", err);
        throw err;
     }
  };

  // Delete Logic
  const deleteImage = async (imageName: string) => {
      try {
          const { error } = await supabase
            .storage
            .from('images')
            .remove([`${folderPath}/${imageName}`]);
          
          if (error) throw error;

          await fetchImages(); // Refresh list to remove local ref
      } catch (err) {
          console.error("Delete failed", err);
          throw err;
      }
  };

  return { images, loading, error, uploadImage, deleteImage, refresh: fetchImages };
}
