import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MachinesService } from '../../core/services/machines.service';
import { Machine } from '../../core/models/machine.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-machines-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.scss'],
})
export class MachinesListComponent implements OnInit {
  private api = inject(MachinesService);
  private markers: L.Marker[] = [];

  allMachines: Machine[] = [];
  paginatedMachines: Machine[] = [];

  loading = false;
  selectedStatus = '';
  statusFilter: string = '';

  map?: L.Map;

  currentPage = 1;
  itemsPerPage = 10;

  editCache: { [key: string]: { location: string; status: string } } = {};

  statuses = [
    { value: '', label: 'All' },
    { value: 'operating', label: 'Operating' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'offline', label: 'Offline' },
  ];

  ngOnInit(): void {
    this.initMap();
    this.fetch();
  }

  get hasCoords(): boolean {
    return this.paginatedMachines.some(
      (m) => m.latitude != null && m.longitude != null
    );
  }

  private initMap() {
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
  }

  applyFilter() {
    const filtered = this.statusFilter
      ? this.allMachines.filter((m) => m.status === this.statusFilter)
      : this.allMachines;

    this.currentPage = 1;
    this.paginateMachines(filtered);

    setTimeout(() => this.renderMap(), 0);
  }

  paginateMachines(source: Machine[]) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedMachines = source.slice(start, end);
  }

  private updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.paginatedMachines = this.allMachines.slice(start, end);
    setTimeout(() => this.renderMap(), 0);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.allMachines.length) {
      this.currentPage++;
      this.applyFilter();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilter();
    }
  }

  fetch() {
    this.loading = true;
    this.api.getAll(this.selectedStatus || undefined).subscribe({
      next: (data) => {
        this.allMachines = data;
        this.currentPage = 1;
        this.updatePagination();

        this.editCache = {};
        this.allMachines.forEach((m) => {
          this.editCache[m.id] = {
            location: m.location ?? '',
            status: m.status ?? '',
          };
        });

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  updateTelemetry(id: string) {
    const updated = this.editCache[id];

    this.api.updateTelemetry(id, updated).subscribe({
      next: (res: Machine) => {
        const index = this.allMachines.findIndex((m) => m.id === id);
        if (index !== -1) this.allMachines[index] = res;
        this.updatePagination();
      },
      error: (err: any) => console.error('Error updating telemetry', err),
    });
  }

  private renderMap() {
    const points = this.paginatedMachines.filter(
      (m) => m.latitude != null && m.longitude != null
    );

    if (!points.length) return;

    if (!this.map) {
      this.map = L.map('map').setView(
        [points[0].latitude!, points[0].longitude!],
        10
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);
    } else {
      this.map.setView([points[0].latitude!, points[0].longitude!], 10);
    }

    this.markers.forEach((marker) => this.map!.removeLayer(marker));
    this.markers = [];

    points.forEach((p) => {
      const marker = L.marker([p.latitude!, p.longitude!])
        .addTo(this.map!)
        .bindPopup(`<b>${p.name}</b><br>${p.location ?? ''}`);

      this.markers.push(marker);
    });
  }
}
