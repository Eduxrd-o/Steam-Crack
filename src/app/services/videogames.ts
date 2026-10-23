import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GameDeal {
  internalName?: string;
  title: string;
  metacriticLink?: string;
  dealID: string;
  storeID: string;
  gameID: string;
  salePrice: string;
  normalPrice: string;
  isOnSale: string;
  savings: string;
  metacriticScore: string;
  steamRatingText?: string;
  steamRatingPercent?: string;
  steamRatingCount?: string;
  steamAppID?: string;
  releaseDate?: number;
  lastChange?: number;
  dealRating?: string;
  thumb: string;
}

@Injectable({
  providedIn: 'root',
})
export class Videogames {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://www.cheapshark.com/api/1.0/deals';

  /**
   * Obtiene la lista de ofertas y videojuegos remotos de Steam.
   * @param pageNumber Número de página (inicia en 0)
   * @param pageSize Cantidad de elementos por página
   * @param storeId ID de tienda (1 = Steam)
   */
  getGames(pageNumber: number = 0, pageSize: number = 10, storeId: string = '1'): Observable<GameDeal[]> {
    const params = new HttpParams()
      .set('storeID', storeId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<GameDeal[]>(this.apiUrl, { params });
  }
}
