import { supabase } from '../lib/supabaseConfig';
import { NotificationService } from './notificationService';

interface Location {
  lat: number;
  lng: number;
}

interface Merchant {
  id: string;
  business_name: string;
  location: string;
  lat?: number;
  lng?: number;
  offers_count?: number;
}

export class GeolocationService {
  private static watchId: number | null = null;
  private static lastNotificationTime: Map<string, number> = new Map();
  private static readonly NOTIFICATION_COOLDOWN = 30 * 60 * 1000; // 30 minutos
  private static readonly PROXIMITY_RADIUS = 500; // 500 metros

  // Iniciar monitoramento de localização
  static startLocationTracking(userId: string): void {
    if (!navigator.geolocation) {
      console.warn('Geolocalização não suportada neste dispositivo');
      return;
    }

    // Parar tracking anterior se existir
    this.stopLocationTracking();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.handleLocationUpdate(userId, {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache por 1 minuto
      }
    );
  }

  // Parar monitoramento de localização
  static stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Processar atualização de localização
  private static async handleLocationUpdate(userId: string, location: Location): Promise<void> {
    try {
      // Salvar localização do usuário
      await this.saveUserLocation(userId, location);
      
      // Verificar parceiros próximos
      const nearbyMerchants = await this.findNearbyMerchants(location);
      
      // Notificar sobre parceiros próximos
      for (const merchant of nearbyMerchants) {
        await this.notifyNearbyMerchant(userId, merchant, location);
      }
    } catch (error) {
      console.error('Erro ao processar atualização de localização:', error);
    }
  }

  // Salvar localização do usuário
  private static async saveUserLocation(userId: string, location: Location): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_locations')
        .upsert({
          user_id: userId,
          lat: location.lat,
          lng: location.lng,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erro ao salvar localização:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar localização:', error);
    }
  }

  // Encontrar parceiros próximos
  private static async findNearbyMerchants(location: Location): Promise<Merchant[]> {
    try {
      // Buscar todos os merchants com localização
      const { data: merchants } = await supabase
        .from('merchants')
        .select(`
          id,
          business_name,
          location,
          lat,
          lng,
          offers:offers(count)
        `)
        .not('lat', 'is', null)
        .not('lng', 'is', null);

      if (!merchants) return [];

      // Filtrar por proximidade
      const nearbyMerchants = merchants.filter(merchant => {
        if (!merchant.lat || !merchant.lng) return false;
        
        const distance = this.calculateDistance(
          location.lat,
          location.lng,
          merchant.lat,
          merchant.lng
        );
        
        return distance <= this.PROXIMITY_RADIUS;
      });

      return nearbyMerchants.map(merchant => ({
        ...merchant,
        offers_count: merchant.offers?.[0]?.count || 0
      }));
    } catch (error) {
      console.error('Erro ao buscar parceiros próximos:', error);
      return [];
    }
  }

  // Calcular distância entre dois pontos (em metros)
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Notificar sobre parceiro próximo
  private static async notifyNearbyMerchant(
    userId: string, 
    merchant: Merchant, 
    userLocation: Location
  ): Promise<void> {
    const now = Date.now();
    const lastNotification = this.lastNotificationTime.get(merchant.id) || 0;
    
    // Verificar cooldown
    if (now - lastNotification < this.NOTIFICATION_COOLDOWN) {
      return;
    }

    try {
      const distance = this.calculateDistance(
        userLocation.lat,
        userLocation.lng,
        merchant.lat!,
        merchant.lng!
      );

      const distanceText = distance < 100 
        ? 'bem próximo' 
        : `a ${Math.round(distance)}m`;

      await NotificationService.create({
        user_id: userId,
        type: 'proximity',
        title: `📍 ${merchant.business_name} está ${distanceText}!`,
        message: merchant.offers_count > 0 
          ? `Há ${merchant.offers_count} oferta(s) disponível(is). Que tal dar uma olhada?`
          : 'Confira o que eles têm para oferecer!'
      });

      // Atualizar tempo da última notificação
      this.lastNotificationTime.set(merchant.id, now);
    } catch (error) {
      console.error('Erro ao notificar parceiro próximo:', error);
    }
  }

  // Obter localização atual uma vez
  static async getCurrentLocation(): Promise<Location | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  // Verificar se o usuário está próximo de um local específico
  static async isNearLocation(
    userLocation: Location, 
    targetLocation: Location, 
    radiusMeters: number = 100
  ): Promise<boolean> {
    const distance = this.calculateDistance(
      userLocation.lat,
      userLocation.lng,
      targetLocation.lat,
      targetLocation.lng
    );
    
    return distance <= radiusMeters;
  }

  // Buscar ofertas próximas
  static async getNearbyOffers(location: Location, radiusKm: number = 5): Promise<{ id: string; title: string; description: string; discount: number; merchant: { business_name: string; location: string } }[]> {
    try {
      // Calcular bounds aproximados
      // const latDelta = radiusKm / 111; // Aproximadamente 111km por grau de latitude
      // const lngDelta = radiusKm / (111 * Math.cos(location.lat * Math.PI / 180));

      const { data: offers } = await supabase
        .from('offers')
        .select(`
          *,
          merchant:merchants(
            id,
            business_name,
            lat,
            lng
          )
        `)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .not('merchant.lat', 'is', null)
        .not('merchant.lng', 'is', null);

      if (!offers) return [];

      // Filtrar por distância real
      const nearbyOffers = offers.filter(offer => {
        if (!offer.merchant?.lat || !offer.merchant?.lng) return false;
        
        const distance = this.calculateDistance(
          location.lat,
          location.lng,
          offer.merchant.lat,
          offer.merchant.lng
        );
        
        return distance <= radiusKm * 1000; // Converter para metros
      });

      // Adicionar distância para ordenação
      return nearbyOffers.map(offer => ({
        ...offer,
        distance: this.calculateDistance(
          location.lat,
          location.lng,
          offer.merchant.lat,
          offer.merchant.lng
        )
      })).sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Erro ao buscar ofertas próximas:', error);
      return [];
    }
  }

  // Solicitar permissão de localização
  static async requestLocationPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'granted') {
        return true;
      }
      
      if (permission.state === 'prompt') {
        // Tentar obter localização para triggerar o prompt
        const location = await this.getCurrentLocation();
        return location !== null;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar permissão de localização:', error);
      return false;
    }
  }

  // Configurar notificações de proximidade
  static async setupProximityNotifications(userId: string): Promise<void> {
    const hasPermission = await this.requestLocationPermission();
    
    if (hasPermission) {
      this.startLocationTracking(userId);
      console.log('✅ Notificações de proximidade ativadas');
    } else {
      console.warn('⚠️ Permissão de localização negada');
    }
  }

  // Limpar dados de localização
  static cleanup(): void {
    this.stopLocationTracking();
    this.lastNotificationTime.clear();
  }
}