export interface Machine {
  id: string;
  name: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: 'operating' | 'maintenance' | 'offline' | string;
}

export interface CreateMachineDto {
  name: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
}

export interface UpdateTelemetryDto {
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
}
