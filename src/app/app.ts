import { Component, signal } from '@angular/core';
import { RouteFormComponent } from './components/route-form/route-form';
import { RouteResultsComponent } from './components/route-results/route-results';
import { RouteService, RouteResult } from './services/route';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouteFormComponent, RouteResultsComponent],
  template: `
    <main class="min-h-screen bg-slate-50 dark:bg-slate-bg text-slate-900 dark:text-slate-100 p-8 transition-colors">
      <div class="max-w-2xl mx-auto">
        <header class="mb-10 flex items-center justify-between">
          <div>
            <span class="text-[20px] font-mono font-bold tracking-widest text-eco uppercase block mb-1">
              GREENROUTE
            </span>
            <h1 class="text-3xl font-sans font-bold tracking-tight">Mobilité & Carbone</h1>
          </div>
        </header>

        <app-route-form (calculate)="onCalculate($event)" />

        <app-route-results [result]="routeResult()" />
      </div>
    </main>
  `
})
export class App {
  routeResult = signal<RouteResult | null>(null);

  constructor(private routeService: RouteService) {}

  async onCalculate(data: { departure: string; destination: string }) {
    const result = await this.routeService.calculateRoute(data.departure, data.destination);
    this.routeResult.set(result);
  }
}