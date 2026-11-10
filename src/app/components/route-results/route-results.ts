import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteResult } from '../../services/route';

@Component({
  selector: 'app-route-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (result()) {
      <div class="mt-8 bg-white dark:bg-slate-card border border-slate-200 dark:border-slate-border rounded-xl p-6 shadow-xl shadow-slate-900/5 transition-colors animate-fadeIn">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-border gap-4">
          <div>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">TRAJET ANALYSÉ</span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">
              {{ result()?.departure | uppercase}} <span class="text-eco">→</span> {{ result()?.destination  | uppercase}}
            </h2>
          </div>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-mono">
            <span class="text-slate-500">Distance estimée :</span>
            <span class="font-bold text-slate-900 dark:text-white">{{ result()?.distanceKm }} km</span>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <h3 class="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Comparatif des modes de transport & impact CO2
          </h3>

          <div class="grid grid-cols-1 gap-3">
            @for (opt of result()?.options; track opt.mode) {
              <div class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-border/60 hover:border-eco/50 transition-all">
                
                <div class="flex items-center gap-4">
                  <span class="text-2xl p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    {{ opt.icon }}
                  </span>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-sans font-bold text-slate-900 dark:text-white text-sm">{{ opt.mode }}</h4>
                      @if (opt.isRecommended) {
                        <span class="text-[10px] font-mono bg-eco/10 text-eco px-2 py-0.5 rounded-full font-semibold">
                          Recommandé vert
                        </span>
                      }
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ opt.description }}</p>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-sm font-bold" [ngClass]="opt.co2TotalKg === 0 ? 'text-eco' : 'text-slate-900 dark:text-white'">
                    {{ opt.co2TotalKg }} kg CO₂
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    ~ {{ opt.durationMinutes }} min
                  </div>
                </div>

              </div>
            }
          </div>
        </div>

      </div>
    }
  `
})
export class RouteResultsComponent {
  result = input<RouteResult | null>(null);
}