import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle, AlertCircle, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEFECT_CATEGORIES = [
  { value: "emocional", label: "Emocional" },
  { value: "fisico", label: "Físico" },
  { value: "personalidad", label: "Personalidad" },
  { value: "habitos", label: "Hábitos" },
];

const profileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  age: z.number().min(18, "Debes tener al menos 18 años").max(100, "Edad inválida"),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface DefectInput {
  id: string;
  category: string;
  title: string;
  description: string;
}

interface PhotoUpload {
  id: string;
  file: File;
  preview: string;
  isValidating: boolean;
  isValidated: boolean;
  validationFeedback: string | null;
}

interface CreateProfileFormProps {
  onSubmit: (data: {
    profile: ProfileFormData;
    defects: DefectInput[];
    photos: File[];
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateProfileForm({ onSubmit, isSubmitting = false }: CreateProfileFormProps) {
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [defects, setDefects] = useState<DefectInput[]>([
    { id: "1", category: "emocional", title: "", description: "" }
  ]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: 18,
      bio: "",
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles: PhotoUpload[] = [];
    
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(`La foto ${file.name} excede el límite de 10MB`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es un archivo de imagen válido`);
        return;
      }

      validFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        isValidating: false,
        isValidated: false,
        validationFeedback: null,
      });
    });

    setPhotos(prev => [...prev, ...validFiles].slice(0, 6));
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const addDefect = () => {
    setDefects(prev => [
      ...prev,
      { 
        id: Math.random().toString(36).substring(7), 
        category: "emocional", 
        title: "", 
        description: "" 
      }
    ]);
  };

  const removeDefect = (id: string) => {
    if (defects.length > 1) {
      setDefects(prev => prev.filter(d => d.id !== id));
    }
  };

  const updateDefect = (id: string, field: keyof DefectInput, value: string) => {
    setDefects(prev => prev.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const handleFormSubmit = async (data: ProfileFormData) => {
    const validDefects = defects.filter(d => d.title && d.description);
    
    if (validDefects.length === 0) {
      alert("Debes agregar al menos un defecto");
      return;
    }

    if (photos.length === 0) {
      alert("Debes subir al menos una foto");
      return;
    }

    await onSubmit({
      profile: data,
      defects: validDefects,
      photos: photos.map(p => p.file),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Información Personal</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Tu nombre"
              className="mt-2"
              data-testid="input-name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              type="number"
              {...form.register("age", { valueAsNumber: true })}
              className="mt-2"
              data-testid="input-age"
            />
            {form.formState.errors.age && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.age.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bio">Bio (Opcional)</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder="Algo más sobre ti..."
              className="mt-2"
              data-testid="input-bio"
            />
          </div>
        </div>
      </Card>

      {/* Photos Upload */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Fotos de tus Defectos Físicos</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Sube fotos que muestren tus defectos físicos. Las fotos serán validadas para mostrar tus defectos y no tus virtudes.
        </p>

        <div className="space-y-4">
          {/* Upload dropzone */}
          {photos.length < 6 && (
            <label className="block">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                data-testid="input-photo-upload"
              />
              <div className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover-elevate active-elevate-2 transition-colors">
                <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-base font-medium mb-2">Sube fotos auténticas</p>
                <p className="text-sm text-muted-foreground">
                  Máximo 6 fotos. PNG, JPG hasta 10MB
                </p>
              </div>
            </label>
          )}

          {/* Photo previews */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                <img 
                  src={photo.preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                
                {/* Validation badge */}
                <div className="absolute top-2 left-2">
                  {photo.isValidating && (
                    <Badge className="bg-blue-500/90 backdrop-blur-sm">
                      Validando...
                    </Badge>
                  )}
                  {photo.isValidated && !photo.validationFeedback && (
                    <Badge className="bg-green-500/90 backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Aprobada
                    </Badge>
                  )}
                  {photo.validationFeedback && (
                    <Badge className="bg-red-500/90 backdrop-blur-sm">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Rechazada
                    </Badge>
                  )}
                </div>

                {/* Remove button */}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(photo.id)}
                  data-testid={`button-remove-photo-${photo.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Validation feedback */}
                {photo.validationFeedback && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-white text-xs">
                    {photo.validationFeedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Defects */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Mis Imperfecciones</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Sé honesto. Comparte tus defectos de personalidad y físicos. Los humanos somos imperfectos, reconócelos y celébralos. Conecta con personas que te acepten tal como eres.
        </p>

        <div className="space-y-4">
          {defects.map((defect, index) => (
            <Card key={defect.id} className="p-4 border-l-4" data-testid={`card-defect-${index}`}>
              <div className="flex items-start justify-between mb-4">
                <Badge variant="outline" className="text-xs">
                  Defecto {index + 1}
                </Badge>
                {defects.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8"
                    onClick={() => removeDefect(defect.id)}
                    data-testid={`button-remove-defect-${index}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Categoría</Label>
                  <Select
                    value={defect.category}
                    onValueChange={(value) => updateDefect(defect.id, "category", value)}
                  >
                    <SelectTrigger className="mt-2" data-testid={`select-category-${index}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFECT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Título</Label>
                  <Input
                    value={defect.title}
                    onChange={(e) => updateDefect(defect.id, "title", e.target.value)}
                    placeholder="Ej: Soy impuntual"
                    className="mt-2"
                    data-testid={`input-defect-title-${index}`}
                  />
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={defect.description}
                    onChange={(e) => updateDefect(defect.id, "description", e.target.value)}
                    placeholder="Describe este defecto con honestidad..."
                    className="mt-2 min-h-32"
                    data-testid={`input-defect-description-${index}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {defect.description.length} caracteres (mínimo recomendado: 100)
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-dashed rounded-xl h-12"
            onClick={addDefect}
            data-testid="button-add-defect"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir otro defecto
          </Button>
        </div>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          data-testid="button-submit-profile"
        >
          {isSubmitting ? "Creando perfil..." : "Crear Perfil"}
        </Button>
      </div>
    </form>
  );
}
