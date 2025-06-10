# svg2ember Project Plan

## Project Status

**Current Phase**: Phase 1 Complete - Core Package Implemented

**Last Updated**: June 2025

## Project Overview

svg2ember is a TypeScript-based tool for converting SVG files into Ember template-only components. The project provides both CLI and Vite plugin interfaces, similar to SVGR for React but tailored for Ember applications.

## Architecture

### Monorepo Structure
```
packages/
├── core/     # Core transformation logic
├── cli/      # Command-line interface
└── vite/     # Vite plugin for development workflow
```

### Data Flow
1. **Input**: SVG file or content
2. **Parse**: Use svg-parser for proper AST-based parsing (no regex/string manipulation)
3. **Optimize**: Apply svgo for SVG optimization
4. **Transform**: Generate Ember component with `...attributes` spread on root `<svg>`
5. **Output**: `.gjs` (JavaScript) or `.gts` (TypeScript) component file

### Package Dependencies
- `core` → standalone (svg-parser, svgo)
- `cli` → depends on `core`
- `vite` → depends on `core`

## Implementation Roadmap

### Phase 1: Core Package ✅ COMPLETE
- [x] Set up core package structure
- [x] Implement SVG parsing using svg-parser
- [x] Integrate svgo optimization
- [x] Create Ember component template generation
- [x] Handle TypeScript vs JavaScript output
- [x] Add comprehensive test coverage

#### Phase 1 Completion Summary
**Completed**: June 2025

The core package (`@svg2ember/core`) is fully implemented with:
- Complete TypeScript package structure with proper build configuration
- AST-based SVG parsing using `svg-parser` (no regex/string manipulation)
- SVGO integration with configurable optimization options
- Ember template-only component generation with `...attributes` spread
- Support for both `.gjs` (JavaScript) and `.gts` (TypeScript) output formats
- Comprehensive test suite with 9 test cases covering all functionality
- Full ESLint compliance and Prettier formatting
- Successfully building and publishing to `dist/` folder

**Key Features Delivered**:
- `transform(svgContent, options)` function as main API
- Proper type definitions with TypeScript support
- Error handling for invalid SVG inputs
- Configurable SVGO optimization settings
- Preservation of SVG attributes while adding `...attributes` spread

### Phase 2: CLI Package
- [ ] Set up CLI package structure
- [ ] Implement single file transformation
- [ ] Add TypeScript flag support (`--typescript`)
- [ ] Implement directory batch processing
- [ ] Add output directory configuration (`--out-dir`)
- [ ] Add ignore existing files flag (`--ignore-existing`)
- [ ] Create CLI tests

### Phase 3: Vite Plugin
- [ ] Set up Vite plugin package structure
- [ ] Implement `?component` query parameter handling
- [ ] Ensure proper attribute spreading to `<svg>` element
- [ ] Handle both component and URL imports
- [ ] Add plugin tests and examples

### Phase 4: Documentation & Publishing
- [ ] Create comprehensive documentation
- [ ] Add usage examples
- [ ] Decide on package publishing scope (scoped vs unscoped)
- [ ] Set up CI/CD pipeline
- [ ] Publish to npm

## Technical Specifications

### Dependencies
- **svg-parser**: For AST-based SVG parsing (ensures proper DOM structure handling)
- **svgo**: For SVG optimization before component generation
- **TypeScript**: Language and tooling throughout all packages

### Key Requirements
- Root `<svg>` element must accept `...attributes` spread
- Support both `.gjs` and `.gts` output formats
- Maintain SVG semantic structure and accessibility
- Optimize SVG content while preserving functionality

### Compatibility
- **Node.js**: 18+ (for modern ESM and TypeScript support)
- **Ember**: Modern Ember applications with template-only component support
- **Build Tools**: ESM-first, compatible with modern bundlers

## Testing Strategy

### Framework
- **Vitest**: Aligns with TypeScript/ESM setup and provides fast testing

### Coverage Areas
- SVG parsing accuracy (various SVG formats and complexities)
- Component generation (proper template syntax)
- Attribute spreading functionality
- CLI argument parsing and file operations
- Vite plugin integration and query parameter handling

### Test Data
- Sample SVG files with varying complexity
- Edge cases (empty SVGs, complex paths, animations)
- Generated component validation

## Package Publishing

**Status**: Deferred until working implementation exists

**Options**:
- Scoped: `@svg2ember/core`, `@svg2ember/cli`, `@svg2ember/vite`
- Unscoped: `svg2ember-core`, `svg2ember-cli`, `svg2ember-vite`

**Decision Factors**:
- Package name availability
- Branding preferences
- npm organization setup

## Success Criteria

### Minimum Viable Product
- ✅ Core package can transform basic SVG to Ember component
- [ ] CLI can process single files and directories
- ✅ Generated components work in Ember applications with attribute spreading

**Status**: Core transformation functionality complete. CLI implementation needed for full MVP.

### Full Feature Set
- Vite plugin enables seamless development workflow
- Comprehensive documentation and examples
- Published packages available for public use
- Test coverage above 80%

## Notes

- Prioritize correctness over performance in initial implementation
- Ensure generated components are idiomatic Ember template-only components
- Maintain compatibility with Ember's attribute spreading conventions