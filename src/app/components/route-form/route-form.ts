import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-slate-card border border-slate-200 dark:border-slate-border rounded-xl p-6 shadow-xl shadow-slate-900/5 transition-colors">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-2.5 h-2.5 rounded-full bg-eco animate-pulse"></div>
        <span class="text-xs font-mono tracking-wider text-eco uppercase font-semibold">
          Analyseur d'impact CO2
        </span>
      </div>

      <h3 class="font-sans text-xl font-bold text-slate-900 dark:text-white mb-6">
        Planifier un trajet bas-carbone
      </h3>
      
      <form (submit)="onSubmit($event)" class="flex flex-col gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">POINT DE DÉPART</label>
          <input 
            type="text" 
            [(ngModel)]="departure" 
            (ngModelChange)="updateDeparture($event)"
            name="departure"
            placeholder="Ex: Lyon"
            class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-border text-sm text-slate-900 dark:text-white focus:outline-none focus:border-eco transition-colors"
          />
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">DESTINATION</label>
          <input 
            type="text" 
            [(ngModel)]="destination" 
            (ngModelChange)="updateDestination($event)"
            name="destination"
            placeholder="Ex: Nice"
            class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-border text-sm text-slate-900 dark:text-white focus:outline-none focus:border-eco transition-colors"
          />
        </div>

        <button 
          type="submit"
          class="mt-2 w-full inline-flex items-center justify-center gap-2 bg-eco hover:bg-eco-dark text-slate-950 font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-md shadow-eco/20 transition-all cursor-pointer"
        >
          Calculer les itinéraires verts
        </button>
      </form>
    </div>
  `
})
export class RouteFormComponent {
  departure = signal('');
  destination = signal('');

  // Fonction utilitaire pour formater en Title Case (gère les espaces et les tirets comme "Saint-Étienne")
  private formatTitleCase(value: string): string {
    return value.replace(/(^|\s|-)([a-zà-öø-ÿ])/g, (match) => match.toUpperCase());
  }

  updateDeparture(value: string) {
    this.departure.set(this.formatTitleCase(value));
  }

  updateDestination(value: string) {
    this.destination.set(this.formatTitleCase(value));
  }

  // Déclaration de l'output moderne avec Angular
  calculate = output<{ departure: string; destination: string }>();

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.departure() && this.destination()) {
      // On émet l'objet contenant le départ et la destination
      this.calculate.emit({
        departure: this.departure(),
        destination: this.destination()
      });
    }
  }
}