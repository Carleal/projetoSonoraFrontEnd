/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector } from '../di/injector';
import { NgModuleFactory } from '../linker/ng_module_factory';
import { initServicesIfNeeded } from './services';
import { Services } from './types';
import { resolveDefinition } from './util';
export function overrideProvider(override) {
    initServicesIfNeeded();
    return Services.overrideProvider(override);
}
export function overrideComponentView(comp, componentFactory) {
    initServicesIfNeeded();
    return Services.overrideComponentView(comp, componentFactory);
}
export function clearOverrides() {
    initServicesIfNeeded();
    return Services.clearOverrides();
}
// Attention: this function is called as top level function.
// Putting any logic in here will destroy closure tree shaking!
export function createNgModuleFactory(ngModuleType, bootstrapComponents, defFactory) {
    return new NgModuleFactory_(ngModuleType, bootstrapComponents, defFactory);
}
function cloneNgModuleDefinition(def) {
    const providers = Array.from(def.providers);
    const modules = Array.from(def.modules);
    const providersByKey = {};
    for (const key in def.providersByKey) {
        providersByKey[key] = def.providersByKey[key];
    }
    return {
        factory: def.factory,
        scope: def.scope,
        providers,
        modules,
        providersByKey,
    };
}
class NgModuleFactory_ extends NgModuleFactory {
    constructor(moduleType, _bootstrapComponents, _ngModuleDefFactory) {
        // Attention: this ctor is called as top level function.
        // Putting any logic in here will destroy closure tree shaking!
        super();
        this.moduleType = moduleType;
        this._bootstrapComponents = _bootstrapComponents;
        this._ngModuleDefFactory = _ngModuleDefFactory;
    }
    create(parentInjector) {
        initServicesIfNeeded();
        // Clone the NgModuleDefinition so that any tree shakeable provider definition
        // added to this instance of the NgModuleRef doesn't affect the cached copy.
        // See https://github.com/angular/angular/issues/25018.
        const def = cloneNgModuleDefinition(resolveDefinition(this._ngModuleDefFactory));
        return Services.createNgModuleRef(this.moduleType, parentInjector || Injector.NULL, this._bootstrapComponents, def);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvZW50cnlwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFHeEMsT0FBTyxFQUFDLGVBQWUsRUFBYyxNQUFNLDZCQUE2QixDQUFDO0FBRXpFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNoRCxPQUFPLEVBQXVGLFFBQVEsRUFBaUIsTUFBTSxTQUFTLENBQUM7QUFDdkksT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRXpDLE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxRQUEwQjtJQUN6RCxvQkFBb0IsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxNQUFNLFVBQVUscUJBQXFCLENBQUMsSUFBZSxFQUFFLGdCQUF1QztJQUM1RixvQkFBb0IsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sUUFBUSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYztJQUM1QixvQkFBb0IsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25DLENBQUM7QUFFRCw0REFBNEQ7QUFDNUQsK0RBQStEO0FBQy9ELE1BQU0sVUFBVSxxQkFBcUIsQ0FDakMsWUFBdUIsRUFBRSxtQkFBZ0MsRUFDekQsVUFBcUM7SUFDdkMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxHQUF1QjtJQUN0RCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM1QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QyxNQUFNLGNBQWMsR0FBOEMsRUFBRSxDQUFDO0lBQ3JFLEtBQUssTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsRUFBRTtRQUNwQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMvQztJQUVELE9BQU87UUFDTCxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87UUFDcEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO1FBQ2hCLFNBQVM7UUFDVCxPQUFPO1FBQ1AsY0FBYztLQUNmLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxnQkFBaUIsU0FBUSxlQUFvQjtJQUNqRCxZQUNvQixVQUFxQixFQUFVLG9CQUFpQyxFQUN4RSxtQkFBOEM7UUFDeEQsd0RBQXdEO1FBQ3hELCtEQUErRDtRQUMvRCxLQUFLLEVBQUUsQ0FBQztRQUpVLGVBQVUsR0FBVixVQUFVLENBQVc7UUFBVSx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQWE7UUFDeEUsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUEyQjtJQUkxRCxDQUFDO0lBRVEsTUFBTSxDQUFDLGNBQTZCO1FBQzNDLG9CQUFvQixFQUFFLENBQUM7UUFDdkIsOEVBQThFO1FBQzlFLDRFQUE0RTtRQUM1RSx1REFBdUQ7UUFDdkQsTUFBTSxHQUFHLEdBQUcsdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUNqRixPQUFPLFFBQVEsQ0FBQyxpQkFBaUIsQ0FDN0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEYsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJy4uL2RpL2luamVjdG9yJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlL3R5cGUnO1xuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5fSBmcm9tICcuLi9saW5rZXIvY29tcG9uZW50X2ZhY3RvcnknO1xuaW1wb3J0IHtOZ01vZHVsZUZhY3RvcnksIE5nTW9kdWxlUmVmfSBmcm9tICcuLi9saW5rZXIvbmdfbW9kdWxlX2ZhY3RvcnknO1xuXG5pbXBvcnQge2luaXRTZXJ2aWNlc0lmTmVlZGVkfSBmcm9tICcuL3NlcnZpY2VzJztcbmltcG9ydCB7TmdNb2R1bGVEZWZpbml0aW9uLCBOZ01vZHVsZURlZmluaXRpb25GYWN0b3J5LCBOZ01vZHVsZVByb3ZpZGVyRGVmLCBQcm92aWRlck92ZXJyaWRlLCBTZXJ2aWNlcywgVmlld0RlZmluaXRpb259IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHtyZXNvbHZlRGVmaW5pdGlvbn0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIG92ZXJyaWRlUHJvdmlkZXIob3ZlcnJpZGU6IFByb3ZpZGVyT3ZlcnJpZGUpIHtcbiAgaW5pdFNlcnZpY2VzSWZOZWVkZWQoKTtcbiAgcmV0dXJuIFNlcnZpY2VzLm92ZXJyaWRlUHJvdmlkZXIob3ZlcnJpZGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3ZlcnJpZGVDb21wb25lbnRWaWV3KGNvbXA6IFR5cGU8YW55PiwgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxhbnk+KSB7XG4gIGluaXRTZXJ2aWNlc0lmTmVlZGVkKCk7XG4gIHJldHVybiBTZXJ2aWNlcy5vdmVycmlkZUNvbXBvbmVudFZpZXcoY29tcCwgY29tcG9uZW50RmFjdG9yeSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck92ZXJyaWRlcygpIHtcbiAgaW5pdFNlcnZpY2VzSWZOZWVkZWQoKTtcbiAgcmV0dXJuIFNlcnZpY2VzLmNsZWFyT3ZlcnJpZGVzKCk7XG59XG5cbi8vIEF0dGVudGlvbjogdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgYXMgdG9wIGxldmVsIGZ1bmN0aW9uLlxuLy8gUHV0dGluZyBhbnkgbG9naWMgaW4gaGVyZSB3aWxsIGRlc3Ryb3kgY2xvc3VyZSB0cmVlIHNoYWtpbmchXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmdNb2R1bGVGYWN0b3J5KFxuICAgIG5nTW9kdWxlVHlwZTogVHlwZTxhbnk+LCBib290c3RyYXBDb21wb25lbnRzOiBUeXBlPGFueT5bXSxcbiAgICBkZWZGYWN0b3J5OiBOZ01vZHVsZURlZmluaXRpb25GYWN0b3J5KTogTmdNb2R1bGVGYWN0b3J5PGFueT4ge1xuICByZXR1cm4gbmV3IE5nTW9kdWxlRmFjdG9yeV8obmdNb2R1bGVUeXBlLCBib290c3RyYXBDb21wb25lbnRzLCBkZWZGYWN0b3J5KTtcbn1cblxuZnVuY3Rpb24gY2xvbmVOZ01vZHVsZURlZmluaXRpb24oZGVmOiBOZ01vZHVsZURlZmluaXRpb24pOiBOZ01vZHVsZURlZmluaXRpb24ge1xuICBjb25zdCBwcm92aWRlcnMgPSBBcnJheS5mcm9tKGRlZi5wcm92aWRlcnMpO1xuICBjb25zdCBtb2R1bGVzID0gQXJyYXkuZnJvbShkZWYubW9kdWxlcyk7XG4gIGNvbnN0IHByb3ZpZGVyc0J5S2V5OiB7W3Rva2VuS2V5OiBzdHJpbmddOiBOZ01vZHVsZVByb3ZpZGVyRGVmfSA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBpbiBkZWYucHJvdmlkZXJzQnlLZXkpIHtcbiAgICBwcm92aWRlcnNCeUtleVtrZXldID0gZGVmLnByb3ZpZGVyc0J5S2V5W2tleV07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZhY3Rvcnk6IGRlZi5mYWN0b3J5LFxuICAgIHNjb3BlOiBkZWYuc2NvcGUsXG4gICAgcHJvdmlkZXJzLFxuICAgIG1vZHVsZXMsXG4gICAgcHJvdmlkZXJzQnlLZXksXG4gIH07XG59XG5cbmNsYXNzIE5nTW9kdWxlRmFjdG9yeV8gZXh0ZW5kcyBOZ01vZHVsZUZhY3Rvcnk8YW55PiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIHJlYWRvbmx5IG1vZHVsZVR5cGU6IFR5cGU8YW55PiwgcHJpdmF0ZSBfYm9vdHN0cmFwQ29tcG9uZW50czogVHlwZTxhbnk+W10sXG4gICAgICBwcml2YXRlIF9uZ01vZHVsZURlZkZhY3Rvcnk6IE5nTW9kdWxlRGVmaW5pdGlvbkZhY3RvcnkpIHtcbiAgICAvLyBBdHRlbnRpb246IHRoaXMgY3RvciBpcyBjYWxsZWQgYXMgdG9wIGxldmVsIGZ1bmN0aW9uLlxuICAgIC8vIFB1dHRpbmcgYW55IGxvZ2ljIGluIGhlcmUgd2lsbCBkZXN0cm95IGNsb3N1cmUgdHJlZSBzaGFraW5nIVxuICAgIHN1cGVyKCk7XG4gIH1cblxuICBvdmVycmlkZSBjcmVhdGUocGFyZW50SW5qZWN0b3I6IEluamVjdG9yfG51bGwpOiBOZ01vZHVsZVJlZjxhbnk+IHtcbiAgICBpbml0U2VydmljZXNJZk5lZWRlZCgpO1xuICAgIC8vIENsb25lIHRoZSBOZ01vZHVsZURlZmluaXRpb24gc28gdGhhdCBhbnkgdHJlZSBzaGFrZWFibGUgcHJvdmlkZXIgZGVmaW5pdGlvblxuICAgIC8vIGFkZGVkIHRvIHRoaXMgaW5zdGFuY2Ugb2YgdGhlIE5nTW9kdWxlUmVmIGRvZXNuJ3QgYWZmZWN0IHRoZSBjYWNoZWQgY29weS5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjUwMTguXG4gICAgY29uc3QgZGVmID0gY2xvbmVOZ01vZHVsZURlZmluaXRpb24ocmVzb2x2ZURlZmluaXRpb24odGhpcy5fbmdNb2R1bGVEZWZGYWN0b3J5KSk7XG4gICAgcmV0dXJuIFNlcnZpY2VzLmNyZWF0ZU5nTW9kdWxlUmVmKFxuICAgICAgICB0aGlzLm1vZHVsZVR5cGUsIHBhcmVudEluamVjdG9yIHx8IEluamVjdG9yLk5VTEwsIHRoaXMuX2Jvb3RzdHJhcENvbXBvbmVudHMsIGRlZik7XG4gIH1cbn1cbiJdfQ==