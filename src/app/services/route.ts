import { Injectable } from '@angular/core';

export interface TransportOption {
  mode: string;
  icon: string;
  co2PerKm: number; // en grammes de CO2 / km
  durationFactor: number;
  description: string;
}

export interface RouteResult {
  departure: string;
  destination: string;
  distanceKm: number;
  options: {
    mode: string;
    icon: string;
    co2TotalKg: number;
    durationMinutes: number;
    description: string;
    isRecommended?: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  
  private transportModes: TransportOption[] = [
    { mode: 'Voiture thermique', icon: '🚗', co2PerKm: 190, durationFactor: 1.0, description: 'Émissions élevées, trajet direct.' },
    { mode: 'Véhicule électrique', icon: '⚡', co2PerKm: 50, durationFactor: 1.05, description: 'Impact réduit selon le mix énergétique.' },
    { mode: 'Transports en commun', icon: '🚌', co2PerKm: 40, durationFactor: 1.4, description: 'Mutualisation des trajets.' },
    { mode: 'Vélo / Mobilité douce', icon: '🚲', co2PerKm: 0, durationFactor: 2.2, description: 'Zéro émission directe, bon pour la santé.' }
  ];

  // Fonction pour transformer un nom de ville en coordonnées GPS [lng, lat]
  private async getCoordinates(address: string): Promise<[number, number] | null> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
      }
    } catch (error) {
      console.error('Erreur lors du géocodage de l\'adresse :', address, error);
    }
    return null;
  }

  // Calcul principal asynchrone avec l'API OSRM
  async calculateRoute(departure: string, destination: string): Promise<RouteResult | null> {
    const depCoords = await this.getCoordinates(departure);
    const destCoords = await this.getCoordinates(destination);

    let distanceKm = 15; // Valeur de repli (fallback) si l'API échoue

    if (depCoords && destCoords) {
      try {
        // Appel à l'API OSRM publique (en voiture par défaut)
        const url = `https://router.project-osrm.org/route/v1/driving/${depCoords[0]},${depCoords[1]};${destCoords[0]},${destCoords[1]}?overview=false`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          // OSRM renvoie la distance en mètres, on la convertit en km
          distanceKm = Number((data.routes[0].distance / 1000).toFixed(1));
        }
      } catch (error) {
        console.error('Erreur lors du calcul OSRM, utilisation d\'une distance estimée.', error);
      }
    }

    const baseDurationMinutes = Math.round(distanceKm * 1.8); // Estimation de base du temps de trajet

    const options = this.transportModes.map(option => {
      const co2TotalKg = Number(((distanceKm * option.co2PerKm) / 1000).toFixed(1));
      const durationMinutes = Math.round(baseDurationMinutes * option.durationFactor);
      
      return {
        mode: option.mode,
        icon: option.icon,
        co2TotalKg,
        durationMinutes,
        description: option.description,
        isRecommended: option.co2PerKm === 0 || option.co2PerKm === 40
      };
    });

    return {
      departure,
      destination,
      distanceKm,
      options: options.sort((a, b) => a.co2TotalKg - b.co2TotalKg)
    };
  }
}