import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonChip,
  IonIcon,
  IonButton,
  IonSpinner,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  flame,
  star,
  pricetag,
  logoSteam,
  reloadOutline,
  checkmarkCircleOutline,
  sparklesOutline,
  alertCircleOutline,
  trendingDownOutline,
  timeOutline,
} from 'ionicons/icons';
import { Videogames, GameDeal } from '../services/videogames';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonChip,
    IonIcon,
    IonButton,
    IonSpinner,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class Tab1Page implements OnInit {
  private videogamesService = inject(Videogames);

  // Lista de juegos remotos
  public games: GameDeal[] = [];

  // Paginación y control de infinite scroll
  public currentPage: number = 0;
  public readonly pageSize: number = 10;
  public hasMore: boolean = true;
  public isLoading: boolean = false;
  public errorMessage: string = '';

  trackByDealId(index: number, game: GameDeal): string {
    return game.dealID || game.gameID || index.toString();
  }

  constructor() {
    addIcons({
      flame,
      star,
      pricetag,
      logoSteam,
      reloadOutline,
      checkmarkCircleOutline,
      sparklesOutline,
      alertCircleOutline,
      trendingDownOutline,
      timeOutline,
    });
  }

  ngOnInit(): void {
    this.loadInitialGames();
  }

  /**
   * Carga la primera página de juegos remotos.
   */
  loadInitialGames(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.currentPage = 0;
    this.hasMore = true;

    this.videogamesService.getGames(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.games = data;
        this.currentPage = 1;
        this.isLoading = false;

        // Si devuelve menos elementos del tamaño de página, se agotaron los datos
        if (data.length < this.pageSize) {
          this.hasMore = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar juegos remotos:', err);
        this.errorMessage = 'No se pudieron cargar los videojuegos. Verifica tu conexión.';
        this.isLoading = false;
      },
    });
  }

  /**
   * R2: Infinite Scrolling (ion-infinite-scroll)
   * Solicita la página siguiente, anexa sin duplicar y detiene el scroll al agotarse los datos.
   */
  loadMoreGames(event: any): void {
    if (!this.hasMore) {
      if (event?.target) {
        event.target.disabled = true;
        event.target.complete();
      }
      return;
    }

    this.videogamesService.getGames(this.currentPage, this.pageSize).subscribe({
      next: (newGames) => {
        // Verificar si la respuesta viene vacía
        if (!newGames || newGames.length === 0) {
          this.hasMore = false;
          if (event?.target) {
            event.target.disabled = true;
            event.target.complete();
          }
          return;
        }

        // Anexar sin duplicar: comprobar contra los IDs existentes (dealID o gameID)
        const existingIds = new Set(this.games.map((g) => g.dealID || g.gameID));
        const uniqueGames = newGames.filter((g) => !existingIds.has(g.dealID || g.gameID));

        if (uniqueGames.length > 0) {
          this.games = [...this.games, ...uniqueGames];
          this.currentPage++;
        }

        // Detener al agotarse los datos (si llegaron menos del tamaño de página o no hubo nuevos)
        if (newGames.length < this.pageSize || uniqueGames.length === 0) {
          this.hasMore = false;
          if (event?.target) {
            event.target.disabled = true;
          }
        }

        if (event?.target) {
          event.target.complete();
        }
      },
      error: (err) => {
        console.error('Error en infinite-scroll:', err);
        if (event?.target) {
          event.target.complete();
        }
      },
    });
  }

  /**
   * Refrescar listado (pull to refresh)
   */
  handleRefresh(event: any): void {
    this.videogamesService.getGames(0, this.pageSize).subscribe({
      next: (data) => {
        this.games = data;
        this.currentPage = 1;
        this.hasMore = data.length >= this.pageSize;
        event.target.complete();
      },
      error: (err) => {
        console.error('Error al refrescar:', err);
        event.target.complete();
      },
    });
  }

  /**
   * Retorna una clase o color según la valoración de Steam
   */
  getRatingBadgeColor(ratingText?: string): string {
    if (!ratingText) return 'medium';
    const text = ratingText.toLowerCase();
    if (text.includes('positive') || text.includes('overwhelmingly')) return 'success';
    if (text.includes('mixed')) return 'warning';
    if (text.includes('negative')) return 'danger';
    return 'tertiary';
  }
}
