import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MachinesService } from '../../core/services/machines.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CreateMachineDto } from '../../core/models/machine.model';

@Component({
  selector: 'app-machine-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.scss'],
})
export class MachineCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(MachinesService);
  private router = inject(Router);
  private http = inject(HttpClient);

  form!: FormGroup;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      location: ['', Validators.required],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      status: ['operating', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  onCepBlur() {
    const cepRaw = this.form.get('cep')?.value || '';
    const cep = cepRaw.replace(/\D/g, '');

    if (cep.length !== 8) {
      alert('CEP inválido! Deve conter 8 dígitos.');
      return;
    }

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (res) => {
        if (res.erro) {
          alert('CEP não encontrado.');
          return;
        }

        const endereco = `${res.logradouro}, ${res.bairro}, ${res.localidade} - ${res.uf}`;
        this.form.patchValue({ location: endereco });

        this.searchLatLon(endereco);
      },
      error: () => {
        alert('Erro ao buscar CEP.');
      },
    });
  }

  private searchLatLon(address: string) {
    const query = `${address}, Brazil`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    this.http.get<any[]>(url).subscribe({
      next: (results) => {
        if (results && results.length > 0) {
          const loc = results[0];
          this.form.patchValue({
            latitude: parseFloat(loc.lat),
            longitude: parseFloat(loc.lon),
          });
        } else {
          alert('Não foi possível encontrar coordenadas para o endereço.');
        }
      },
      error: () => {
        alert('Erro ao buscar coordenadas.');
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const raw = this.form.value;

    const payload: CreateMachineDto = {
      name: raw.name,
      status: raw.status,
      location: raw.location,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };

    this.api.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/machines']);
      },
      error: () => {
        this.errorMessage = 'Failed to create machine. Try again.';
        this.loading = false;
      },
    });
  }
}
