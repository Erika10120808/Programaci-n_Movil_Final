import { TestBed } from '@angular/core/testing';

import { AniMangaService } from './ani-manga.service';

describe('AniMangaService', () => {
  let service: AniMangaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AniMangaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
