/// <amd-module name="@angular/compiler-cli/src/ngtsc/imports/src/emitter" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Expression } from '@angular/compiler';
import * as ts from 'typescript';
import { UnifiedModulesHost } from '../../core/api';
import { LogicalFileSystem } from '../../file_system';
import { DeclarationNode, ReflectionHost } from '../../reflection';
import { Reference } from './references';
import { ModuleResolver } from './resolver';
/**
 * Flags which alter the imports generated by the `ReferenceEmitter`.
 */
export declare enum ImportFlags {
    None = 0,
    /**
     * Force the generation of a new import when generating a reference, even if an identifier already
     * exists in the target file which could be used instead.
     *
     * This is sometimes required if there's a risk TypeScript might remove imports during emit.
     */
    ForceNewImport = 1,
    /**
     * Don't make use of any aliasing information when emitting a reference.
     *
     * This is sometimes required if emitting into a context where generated references will be fed
     * into TypeScript and type-checked (such as in template type-checking).
     */
    NoAliasing = 2,
    /**
     * Indicates that an import to a type-only declaration is allowed.
     *
     * For references that occur in type-positions, the referred declaration may be a type-only
     * declaration that is not retained during emit. Including this flag allows to emit references to
     * type-only declarations as used in e.g. template type-checking.
     */
    AllowTypeImports = 4
}
/**
 * An emitter strategy has the ability to indicate which `ts.SourceFile` is being imported by the
 * expression that it has generated. This information is useful for consumers of the emitted
 * reference that would otherwise have to perform a relatively expensive module resolution step,
 * e.g. for cyclic import analysis. In cases the emitter is unable to definitively determine the
 * imported source file or a computation would be required to actually determine the imported
 * source file, then `'unknown'` should be returned. If the generated expression does not represent
 * an import then `null` should be used.
 */
export declare type ImportedFile = ts.SourceFile | 'unknown' | null;
/**
 * Represents the emitted expression of a `Reference` that is valid in the source file it was
 * emitted from.
 */
export interface EmittedReference {
    /**
     * The expression that refers to `Reference`.
     */
    expression: Expression;
    /**
     * The `ts.SourceFile` that is imported by `expression`. This is not necessarily the source file
     * of the `Reference`'s declaration node, as the reference may have been rewritten through an
     * alias export. It could also be `null` if `expression` is a local identifier, or `'unknown'` if
     * the exact source file that is being imported is not known to the emitter.
     */
    importedFile: ImportedFile;
}
/**
 * A particular strategy for generating an expression which refers to a `Reference`.
 *
 * There are many potential ways a given `Reference` could be referred to in the context of a given
 * file. A local declaration could be available, the `Reference` could be importable via a relative
 * import within the project, or an absolute import into `node_modules` might be necessary.
 *
 * Different `ReferenceEmitStrategy` implementations implement specific logic for generating such
 * references. A single strategy (such as using a local declaration) may not always be able to
 * generate an expression for every `Reference` (for example, if no local identifier is available),
 * and may return `null` in such a case.
 */
export interface ReferenceEmitStrategy {
    /**
     * Emit an `Expression` which refers to the given `Reference` in the context of a particular
     * source file, if possible.
     *
     * @param ref the `Reference` for which to generate an expression
     * @param context the source file in which the `Expression` must be valid
     * @param importFlags a flag which controls whether imports should be generated or not
     * @returns an `EmittedReference` which refers to the `Reference`, or `null` if none can be
     *   generated
     */
    emit(ref: Reference, context: ts.SourceFile, importFlags: ImportFlags): EmittedReference | null;
}
/**
 * Generates `Expression`s which refer to `Reference`s in a given context.
 *
 * A `ReferenceEmitter` uses one or more `ReferenceEmitStrategy` implementations to produce an
 * `Expression` which refers to a `Reference` in the context of a particular file.
 */
export declare class ReferenceEmitter {
    private strategies;
    constructor(strategies: ReferenceEmitStrategy[]);
    emit(ref: Reference, context: ts.SourceFile, importFlags?: ImportFlags): EmittedReference;
}
/**
 * A `ReferenceEmitStrategy` which will refer to declarations by any local `ts.Identifier`s, if
 * such identifiers are available.
 */
export declare class LocalIdentifierStrategy implements ReferenceEmitStrategy {
    emit(ref: Reference, context: ts.SourceFile, importFlags: ImportFlags): EmittedReference | null;
}
/**
 * Represents the exported declarations from a module source file.
 */
interface ModuleExports {
    /**
     * The source file of the module.
     */
    module: ts.SourceFile;
    /**
     * The map of declarations to their exported name.
     */
    exportMap: Map<DeclarationNode, string>;
}
/**
 * A `ReferenceEmitStrategy` which will refer to declarations that come from `node_modules` using
 * an absolute import.
 *
 * Part of this strategy involves looking at the target entry point and identifying the exported
 * name of the targeted declaration, as it might be different from the declared name (e.g. a
 * directive might be declared as FooDirImpl, but exported as FooDir). If no export can be found
 * which maps back to the original directive, an error is thrown.
 */
export declare class AbsoluteModuleStrategy implements ReferenceEmitStrategy {
    protected program: ts.Program;
    protected checker: ts.TypeChecker;
    protected moduleResolver: ModuleResolver;
    private reflectionHost;
    /**
     * A cache of the exports of specific modules, because resolving a module to its exports is a
     * costly operation.
     */
    private moduleExportsCache;
    constructor(program: ts.Program, checker: ts.TypeChecker, moduleResolver: ModuleResolver, reflectionHost: ReflectionHost);
    emit(ref: Reference, context: ts.SourceFile, importFlags: ImportFlags): EmittedReference | null;
    private getExportsOfModule;
    protected enumerateExportsOfModule(specifier: string, fromFile: string): ModuleExports | null;
}
/**
 * A `ReferenceEmitStrategy` which will refer to declarations via relative paths, provided they're
 * both in the logical project "space" of paths.
 *
 * This is trickier than it sounds, as the two files may be in different root directories in the
 * project. Simply calculating a file system relative path between the two is not sufficient.
 * Instead, `LogicalProjectPath`s are used.
 */
export declare class LogicalProjectStrategy implements ReferenceEmitStrategy {
    private reflector;
    private logicalFs;
    constructor(reflector: ReflectionHost, logicalFs: LogicalFileSystem);
    emit(ref: Reference, context: ts.SourceFile): EmittedReference | null;
}
/**
 * A `ReferenceEmitStrategy` which constructs relatives paths between `ts.SourceFile`s.
 *
 * This strategy can be used if there is no `rootDir`/`rootDirs` structure for the project which
 * necessitates the stronger logic of `LogicalProjectStrategy`.
 */
export declare class RelativePathStrategy implements ReferenceEmitStrategy {
    private reflector;
    constructor(reflector: ReflectionHost);
    emit(ref: Reference, context: ts.SourceFile): EmittedReference | null;
}
/**
 * A `ReferenceEmitStrategy` which uses a `UnifiedModulesHost` to generate absolute import
 * references.
 */
export declare class UnifiedModulesStrategy implements ReferenceEmitStrategy {
    private reflector;
    private unifiedModulesHost;
    constructor(reflector: ReflectionHost, unifiedModulesHost: UnifiedModulesHost);
    emit(ref: Reference, context: ts.SourceFile): EmittedReference | null;
}
export {};
