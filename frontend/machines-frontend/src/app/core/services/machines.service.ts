import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Machine, CreateMachineDto, UpdateTelemetryDto } from '../models/machine.model';

@Injectable({ providedIn: 'root' })
export class MachinesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/machines`;

  getAll(status?: string): Observable<Machine[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Machine[]>(this.base, { params });
  }

  getById(id: string): Observable<Machine> {
    return this.http.get<Machine>(`${this.base}/${id}`);
  }

  create(body: CreateMachineDto): Observable<Machine> {
    return this.http.post<Machine>(this.base, body);
  }

  updateTelemetry(id: string, body: UpdateTelemetryDto): Observable<Machine> {
    return this.http.put<Machine>(`${this.base}/${id}/telemetry`, body);
  }
}
