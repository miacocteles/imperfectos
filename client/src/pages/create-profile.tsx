import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateProfileForm } from "@/components/create-profile-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function CreateProfile() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check if user already has a profile
  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/current-user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/current-user");
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
  });

  // Redirect to home if user already exists (already has profile)
  useEffect(() => {
    if (currentUser?.user) {
      toast({
        title: "Ya tienes un perfil",
        description: "Solo puedes crear un perfil por cuenta",
      });
      setLocation("/");
    }
  }, [currentUser, setLocation, toast]);

  const createProfileMutation = useMutation({
    mutationFn: async (data: {
      profile: { name: string; age: number; bio?: string };
      defects: Array<{ category: string; title: string; description: string }>;
      photos: File[];
      defectPhotos: { defectIndex: number; file: File }[];
    }) => {
      // Validate file sizes
      for (const photo of data.photos) {
        if (photo.size > 10 * 1024 * 1024) {
          throw new Error(`La foto ${photo.name} excede el límite de 10MB`);
        }
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", data.profile.name);
      formData.append("age", data.profile.age.toString());
      if (data.profile.bio) {
        formData.append("bio", data.profile.bio);
      }
      formData.append("defects", JSON.stringify(data.defects));
      
      data.photos.forEach((photo) => {
        formData.append(`photos`, photo);
      });

      // Add defect photos
      data.defectPhotos.forEach((defectPhoto) => {
        formData.append(`defectPhotos[${defectPhoto.defectIndex}]`, defectPhoto.file);
      });

      const response = await fetch("/api/profiles", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear perfil");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Perfil creado!",
        description: "Tu perfil ha sido creado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current-user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/discover"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crea tu Perfil</h1>
          <p className="text-base text-muted-foreground">
            Sé honesto. La autenticidad es lo que nos hace especiales.
          </p>
        </div>

        <CreateProfileForm
          onSubmit={(data) => createProfileMutation.mutateAsync(data)}
          isSubmitting={createProfileMutation.isPending}
        />
      </div>
    </div>
  );
}
