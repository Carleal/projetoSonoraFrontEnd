/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { COMPILER_OPTIONS, CompilerFactory, createPlatformFactory, Injector } from '@angular/core';
import { ɵTestingCompilerFactory as TestingCompilerFactory } from '@angular/core/testing';
import { ɵplatformCoreDynamic as platformCoreDynamic } from '@angular/platform-browser-dynamic';
import { COMPILER_PROVIDERS, TestingCompilerFactoryImpl } from './compiler_factory';
const ɵ0 = { providers: COMPILER_PROVIDERS };
/**
 * Platform for dynamic tests
 *
 * @publicApi
 */
export const platformCoreDynamicTesting = createPlatformFactory(platformCoreDynamic, 'coreDynamicTesting', [
    { provide: COMPILER_OPTIONS, useValue: ɵ0, multi: true }, {
        provide: TestingCompilerFactory,
        useClass: TestingCompilerFactoryImpl,
        deps: [Injector, CompilerFactory]
    }
]);
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fY29yZV9keW5hbWljX3Rlc3RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvdGVzdGluZy9zcmMvcGxhdGZvcm1fY29yZV9keW5hbWljX3Rlc3RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFDOUcsT0FBTyxFQUFDLHVCQUF1QixJQUFJLHNCQUFzQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDeEYsT0FBTyxFQUFDLG9CQUFvQixJQUFJLG1CQUFtQixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFFOUYsT0FBTyxFQUFDLGtCQUFrQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7V0FTdEMsRUFBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUM7QUFQM0U7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUNuQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRTtJQUMvRCxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLElBQWlDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxFQUFFO1FBQ25GLE9BQU8sRUFBRSxzQkFBc0I7UUFDL0IsUUFBUSxFQUFFLDBCQUEwQjtRQUNwQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDO0tBQ2xDO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q09NUElMRVJfT1BUSU9OUywgQ29tcGlsZXJGYWN0b3J5LCBjcmVhdGVQbGF0Zm9ybUZhY3RvcnksIEluamVjdG9yLCBQbGF0Zm9ybVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge8m1VGVzdGluZ0NvbXBpbGVyRmFjdG9yeSBhcyBUZXN0aW5nQ29tcGlsZXJGYWN0b3J5fSBmcm9tICdAYW5ndWxhci9jb3JlL3Rlc3RpbmcnO1xuaW1wb3J0IHvJtXBsYXRmb3JtQ29yZUR5bmFtaWMgYXMgcGxhdGZvcm1Db3JlRHluYW1pY30gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljJztcblxuaW1wb3J0IHtDT01QSUxFUl9QUk9WSURFUlMsIFRlc3RpbmdDb21waWxlckZhY3RvcnlJbXBsfSBmcm9tICcuL2NvbXBpbGVyX2ZhY3RvcnknO1xuXG4vKipcbiAqIFBsYXRmb3JtIGZvciBkeW5hbWljIHRlc3RzXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgcGxhdGZvcm1Db3JlRHluYW1pY1Rlc3Rpbmc6IChleHRyYVByb3ZpZGVycz86IGFueVtdKSA9PiBQbGF0Zm9ybVJlZiA9XG4gICAgY3JlYXRlUGxhdGZvcm1GYWN0b3J5KHBsYXRmb3JtQ29yZUR5bmFtaWMsICdjb3JlRHluYW1pY1Rlc3RpbmcnLCBbXG4gICAgICB7cHJvdmlkZTogQ09NUElMRVJfT1BUSU9OUywgdXNlVmFsdWU6IHtwcm92aWRlcnM6IENPTVBJTEVSX1BST1ZJREVSU30sIG11bHRpOiB0cnVlfSwge1xuICAgICAgICBwcm92aWRlOiBUZXN0aW5nQ29tcGlsZXJGYWN0b3J5LFxuICAgICAgICB1c2VDbGFzczogVGVzdGluZ0NvbXBpbGVyRmFjdG9yeUltcGwsXG4gICAgICAgIGRlcHM6IFtJbmplY3RvciwgQ29tcGlsZXJGYWN0b3J5XVxuICAgICAgfVxuICAgIF0pO1xuIl19