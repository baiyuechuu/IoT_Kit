# IoT Kit Project Refactor Proposal

## Current Issues Identified

1. **Inconsistent naming**: Mixed case conventions (Website vs Hardware)
2. **Unclear separation**: Hardware projects are not clearly categorized
3. **Scattered configuration**: Multiple package.json files at different levels
4. **Unclear purpose**: Some directories lack clear purpose (Scripts, assets)
5. **Missing structure**: Server directory is mostly empty

## Proposed New Structure

```
iot-kit/
├── README.md
├── LICENSE.md
├── package.json (root workspace)
├── .gitignore
├── .github/
│   └── workflows/
├── docs/
│   ├── api/
│   ├── hardware/
│   ├── deployment/
│   └── development/
├── frontend/ (renamed from Website)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── features/
│   │   │   └── shared/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── lib/
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/ (renamed from Server)
│   ├── cmd/
│   │   └── server/
│   ├── internal/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── services/
│   ├── pkg/
│   ├── go.mod
│   └── go.sum
├── hardware/
│   ├── libraries/
│   │   └── firebase-freertos/
│   ├── examples/
│   │   └── firebase-test/
│   ├── schematics/
│   └── docs/
├── scripts/
│   ├── build/
│   ├── deploy/
│   └── dev/
├── tools/
│   ├── generators/
│   └── utilities/
└── shared/
    ├── types/
    └── constants/
```

## Key Improvements

### 1. **Clear Domain Separation**
- `frontend/` - Web application
- `backend/` - Server-side code
- `hardware/` - Embedded systems and IoT code
- `shared/` - Common types and utilities

### 2. **Better Organization**
- **Libraries vs Examples**: Separate reusable libraries from example projects
- **Documentation**: Centralized docs with clear sections
- **Scripts**: Organized by purpose (build, deploy, dev)
- **Tools**: Development utilities and generators

### 3. **Consistent Naming**
- All lowercase with hyphens for directories
- Clear, descriptive names
- Consistent across all domains

### 4. **Scalable Structure**
- Easy to add new hardware projects
- Clear separation of concerns
- Monorepo-friendly organization

## Migration Plan

### Phase 1: Create New Structure
1. Create new directory structure
2. Move existing files to new locations
3. Update import paths and references

### Phase 2: Update Configuration
1. Update package.json files
2. Update build scripts
3. Update CI/CD workflows

### Phase 3: Documentation
1. Update README files
2. Create development guides
3. Document new structure

## Benefits

1. **Maintainability**: Clear separation makes it easier to find and modify code
2. **Scalability**: Easy to add new features and projects
3. **Onboarding**: New developers can quickly understand the project structure
4. **Deployment**: Clear separation enables independent deployment strategies
5. **Testing**: Better organization supports comprehensive testing strategies

## Implementation Steps

1. **Backup current structure**
2. **Create new directories**
3. **Move files systematically**
4. **Update all import paths**
5. **Test all functionality**
6. **Update documentation**
7. **Commit changes**

Would you like me to proceed with implementing this refactor? 