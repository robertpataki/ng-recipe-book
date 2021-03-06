import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { RecipeService } from '../recipes/recipe.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService,
              private recipeService: RecipeService,
              private slService: ShoppingListService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        // If not logged in, just use the original request (no login token attached)
        if (!user) {
          return next.handle(req);
        }

        // If logged in, attach the token to every request
        const modifiedReq = req.clone({ 
          params: new HttpParams().set('auth', user.token) 
        });
        return next.handle(modifiedReq);
      }));
  }
}