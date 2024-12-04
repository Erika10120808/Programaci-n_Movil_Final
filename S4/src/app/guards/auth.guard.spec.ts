import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
 
  const isAuthenticated = !!localStorage.getItem('authToken'); 
  return isAuthenticated;
};

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => authGuard(route, state));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should allow access when authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockAuthToken'); 
    expect(executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBe(true);
  });

  it('should deny access when not authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); 
    expect(executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBe(false);
  });
});
