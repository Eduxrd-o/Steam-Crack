import { TestBed } from '@angular/core/testing';
import { Videogames } from './videogames';

describe('Videogames', () => {
  let service: Videogames;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Videogames);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
