# Widget Development Quick Reference

## 🎯 Widget Size Constraints

```typescript
WIDGET_CONSTRAINTS = {
  "button":       { minW: 2, maxW: 4, minH: 1, maxH: 2 },
  "label":        { minW: 2, maxW: 4, minH: 2, maxH: 3 },
  "switch":       { minW: 2, maxW: 3, minH: 2, maxH: 3 },
  "device-table": { minW: 4, maxW: 8, minH: 4, maxH: 8 },
}
```

## 🔧 Widget Component Template

```typescript
interface MyWidgetProps {
  id: string;
  title?: string;
  editMode?: boolean;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  // Custom props...
}

export function MyWidget(props: MyWidgetProps) {
  return (
    <Card className="p-3 h-full flex flex-col relative group">
      {props.editMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
          <button className="p-1 hover:bg-background/80 rounded" onClick={props.onSettings}>
            <Settings className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-background/80 rounded" onClick={props.onDuplicate}>
            <Copy className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-background/80 rounded" onClick={props.onDelete}>
            <Trash2 className="w-3 h-3 text-destructive" />
          </button>
        </div>
      )}
      {/* Widget content */}
    </Card>
  );
}
```

## 📝 Registration Checklist

### 1. Export in `widgets/index.tsx`
```typescript
export { MyWidget } from "./MyWidget";
export type WidgetType = "..." | "my-widget";
export const WIDGET_CONSTRAINTS = { 
  "my-widget": { minW: 2, maxW: 4, minH: 2, maxH: 3 } 
};
```

### 2. Add to Grid Renderer
```typescript
// DashboardGrid.tsx
case "my-widget":
  return <MyWidget {...commonProps} />;
```

### 3. Add to Widget Picker
```typescript
// AddWidgetDialog.tsx
const WIDGET_TYPES = [
  {
    type: "my-widget" as WidgetType,
    name: "My Widget",
    description: "Description here",
    icon: MyIcon,
    color: "bg-purple-500",
  },
];
```

### 4. Add Configuration Form
```typescript
// AddWidgetDialog.tsx & WidgetSettingsDialog.tsx
{selectedType === "my-widget" && (
  <div className="space-y-2">
    <label className="text-sm font-medium">Property Name *</label>
    <input
      type="text"
      value={formData.myProp || ""}
      onChange={(e) => setFormData(prev => ({ ...prev, myProp: e.target.value }))}
      required
    />
  </div>
)}
```

## 🎨 Styling Guidelines

```css
/* Widget Container */
.widget-container {
  padding: 12px;           /* p-3 */
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Edit Mode Actions */
.edit-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 200ms;
  z-index: 10;
  display: flex;
  gap: 4px;
}

.widget-container:hover .edit-actions {
  opacity: 1;
}

/* Responsive Text */
.widget-title {
  font-size: 0.875rem;      /* text-sm */
  font-weight: 500;         /* font-medium */
  color: hsl(var(--muted-foreground));
  text-align: center;
  line-height: 1.25;        /* leading-tight */
}

.widget-value {
  font-size: 1.25rem;       /* text-xl */
  font-weight: 700;         /* font-bold */
  line-height: 1;           /* leading-none */
}

@media (min-width: 1024px) {
  .widget-value {
    font-size: 1.5rem;      /* lg:text-2xl */
  }
}
```

## 🔄 State Management Patterns

```typescript
// Widget State in Parent
const [widgets, setWidgets] = useState<WidgetConfig[]>([]);

// Add Widget
const addWidget = (type: WidgetType, props: Record<string, any>) => {
  const newWidget = {
    i: `${type}-${Date.now()}`,
    type,
    x: 0, y: 0,
    w: WIDGET_CONSTRAINTS[type].minW,
    h: WIDGET_CONSTRAINTS[type].minH,
    props
  };
  setWidgets(prev => [...prev, newWidget]);
};

// Update Widget
const updateWidget = (widgetId: string, updates: Partial<WidgetConfig>) => {
  setWidgets(prev => prev.map(w => 
    w.i === widgetId ? { ...w, ...updates } : w
  ));
};

// Delete Widget
const deleteWidget = (widgetId: string) => {
  setWidgets(prev => prev.filter(w => w.i !== widgetId));
};
```

## 🐛 Common Pitfalls

❌ **Don't**: Use absolute positioning for widget content  
✅ **Do**: Use flexbox for layout

❌ **Don't**: Hardcode widget dimensions  
✅ **Do**: Use `h-full w-full` and let grid control size

❌ **Don't**: Forget hover states for edit actions  
✅ **Do**: Always implement opacity transitions

❌ **Don't**: Skip form validation  
✅ **Do**: Validate required fields and data types

❌ **Don't**: Use complex state in widgets  
✅ **Do**: Keep widget state minimal and controlled

## 🔍 Debug Commands

```typescript
// Log current layout
console.table(widgets.map(w => ({
  id: w.i,
  type: w.type,
  position: `${w.x},${w.y}`,
  size: `${w.w}×${w.h}`
})));

// Validate constraints
widgets.forEach(w => {
  const c = WIDGET_CONSTRAINTS[w.type];
  if (w.w < c.minW || w.w > c.maxW || w.h < c.minH || w.h > c.maxH) {
    console.warn(`Widget ${w.i} violates constraints:`, w);
  }
});

// Check for overlaps (shouldn't happen)
widgets.forEach((w1, i) => {
  widgets.slice(i + 1).forEach(w2 => {
    if (!(w1.x >= w2.x + w2.w || w1.x + w1.w <= w2.x ||
          w1.y >= w2.y + w2.h || w1.y + w1.h <= w2.y)) {
      console.error(`Overlap detected:`, w1.i, w2.i);
    }
  });
});
```

## 🎯 Performance Tips

- Use `React.memo` for pure widget components
- Implement `useCallback` for event handlers
- Avoid re-creating objects in render
- Limit dashboard to ~50 widgets max
- Use CSS transforms for animations
- Debounce layout change handlers 