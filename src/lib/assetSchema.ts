import { z } from "zod";

export const assetSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre es demasiado largo"),
    type: z.string().min(1, "Debe seleccionar un tipo"),
    status: z.string().min(1, "Debe seleccionar un estado"),
    model: z.string().max(100, "Modelo demasiado largo").optional().or(z.literal("")),
    serialNumber: z.string().max(100, "Número de serie demasiado largo").optional().or(z.literal("")),
    assignedTo: z.string().max(100, "Nombre demasiado largo").optional().or(z.literal("")),
    // Campos adicionales para compatibilidad con Supabase (mismo shape que se envía)
    location: z.string().min(1, "Debe seleccionar una ubicación"),
    purchaseDate: z.string().optional(),
    notes: z.string().max(2000).optional().or(z.literal("")),
    operatingSystem: z.string().max(200).optional().or(z.literal("")),
    rental: z.string().max(200).optional().or(z.literal("")),
    deliveryNote: z.string().max(200).optional().or(z.literal("")),
    teamviewerId: z.string().max(200).optional().or(z.literal("")),
    phoneNumber: z.string().max(100).optional().or(z.literal("")),
    pin: z.string().max(50).optional().or(z.literal("")),
    puk: z.string().max(50).optional().or(z.literal("")),
    imei1: z.string().max(100).optional().or(z.literal("")),
    imei2: z.string().max(100).optional().or(z.literal("")),
  });

export type AssetFormData = z.infer<typeof assetSchema>;
