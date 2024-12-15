import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiService]
        });
        service = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create an item', () => {
        const mockData = { id: '1', name: 'Test Item' };
        service.createItem(mockData).subscribe(response => {
            expect(response).toEqual(mockData);
        });

        const req = httpMock.expectOne(`${service['baseUrl']}/items`);
        expect(req.request.method).toBe('POST');
        req.flush(mockData);
    });

    it('should get an item by id', () => {
        const mockItem = { id: '1', name: 'Test Item' };
        service.getItem('1').subscribe(response => {
            expect(response).toEqual(mockItem);
        });

        const req = httpMock.expectOne(`${service['baseUrl']}/items/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockItem);
    });

    it('should delete an item', () => {
        service.deleteItem('1').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(`${service['baseUrl']}/items/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

});