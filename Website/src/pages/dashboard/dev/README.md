# Dev Dashboard - Widget System

A Blynk-inspired drag-and-drop widget dashboard for IoT device management.

## 🚀 Quick Start

```typescript
import DevPage from './DevPage';

// Basic usage
<DevPage />
```

## 📱 Features

- **Drag & Drop**: Move widgets with grid constraints
- **Responsive Grid**: 12-column layout with collision detection
- **Widget Types**: Button, Label, Switch, Device Table
- **Edit Modes**: Desktop edit mode with mobile fallback
- **Configuration**: Step-by-step widget setup

## 🎛 Widget Types

| Widget | Size | Purpose |
|--------|------|---------|
| Button | 2×1 - 4×2 | Actions & triggers |
| Label | 2×2 - 4×3 | Data display |
| Switch | 2×2 - 3×3 | Toggle controls |
| Device Table | 4×4 - 8×8 | Device lists |

## 🔧 Development

### Adding New Widgets

1. Create widget component in `components/widgets/`
2. Add to `WIDGET_CONSTRAINTS` in `widgets/index.tsx`
3. Update grid renderer in `DashboardGrid.tsx`
4. Add configuration forms in dialogs

### Key Files

```
dev/
├── DevPage.tsx                 # Main dashboard
├── components/
│   ├── DashboardGrid.tsx       # Grid system
│   ├── AddWidgetDialog.tsx     # Widget creation
│   ├── WidgetSettingsDialog.tsx # Widget editing
│   └── widgets/               # Widget components
```

## 📖 Documentation

See `WIDGET_DASHBOARD_DOCS.md` for complete development manual.

## 🎯 Rules

- **Grid**: 12 columns, 60px row height
- **Collision**: Widgets push, never overlap
- **Desktop Only**: Edit features require >768px width
- **Size Limits**: Each widget type has min/max constraints
- **Required Fields**: Title mandatory for all widgets 