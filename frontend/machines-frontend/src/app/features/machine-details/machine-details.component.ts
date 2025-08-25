import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MachinesService } from '../../core/services/machines.service';
import { Machine } from '../../core/models/machine.model';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

@Component({
  selector: 'app-machine-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './machine-details.component.html',
  styleUrls: ['./machine-details.component.scss'],
})
export class MachineDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(MachinesService);
  private fb = inject(FormBuilder);

  machine?: Machine;
  loading = false;

  form = this.fb.group({
    location: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    status: ['offline', Validators.required],
  });

  statuses = [
    { value: 'operating', label: 'Operating' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'offline', label: 'Offline' },
  ];

  map?: L.Map;

  get hasCoords(): boolean {
    return this.machine?.latitude != null && this.machine?.longitude != null;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;

    this.api.getById(id).subscribe({
      next: (m) => {
        this.machine = m;

        this.form.patchValue({
          location: m.location ?? '',
          latitude: m.latitude ?? null,
          longitude: m.longitude ?? null,
          status: m.status,
        });

        this.loading = false;

        setTimeout(() => this.renderMap(), 0);
      },
      error: () => (this.loading = false),
    });
  }

  save() {
    if (!this.machine) return;

    this.api
      .updateTelemetry(this.machine.id, this.form.value as any)
      .subscribe({
        next: (m) => {
          this.machine = m;
          alert('Updated!');
          setTimeout(() => this.renderMap(), 0);
        },
      });
  }

  private renderMap() {
    if (
      !this.machine ||
      this.machine.latitude == null ||
      this.machine.longitude == null
    )
      return;

    const lat = this.machine.latitude;
    const lng = this.machine.longitude;

    if (!this.map) {
      this.map = L.map('details-map').setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);
    }

    this.map.eachLayer((layer) => {
      if ((layer as any)._latlng) {
        this.map!.removeLayer(layer);
      }
    });

    L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(
        `<b>${this.machine.name}</b><br>${this.machine.location ?? ''}`
      )
      .openPopup();
  }
}
