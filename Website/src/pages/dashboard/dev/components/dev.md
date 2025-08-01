# Hướng Dẫn Phát Triển Widget

Hướng dẫn này giải thích cách phát triển thủ công các widget cho hệ thống dashboard IoT Kit, sử dụng Temperature Widget làm ví dụ.

## Tổng Quan

Widgets là các thành phần mô-đun hiển thị dữ liệu IoT trong dashboard. Mỗi widget bao gồm:
- **Component**: React component để render widget
- **Configuration**: TypeScript interfaces định nghĩa thuộc tính widget
- **Settings**: Schema form cho cấu hình widget
- **Registry**: Đăng ký trong hệ thống widget

## Cấu Trúc Tệp

```
components/widgets/
├── BaseWidget.tsx           # Base widget wrapper và utilities
├── TemperatureWidget.tsx    # Temperature widget component
├── types.tsx               # TypeScript interfaces
├── registry.tsx            # Widget registration
├── settings/
│   ├── index.tsx           # Settings registry
│   ├── WidgetSettingsFramework.tsx  # Settings form framework
│   └── TemperatureWidgetSettings.tsx # Temperature widget settings
└── index.tsx               # Main exports
```

## Bước 1: Định Nghĩa Widget Types

Đầu tiên, thêm widget type của bạn vào union `WidgetType` trong `types.tsx`:

```typescript
export type WidgetType = "temperature" | "your_widget" | ...;
```

## Bước 2: Tạo Widget Configuration Interface

Trong `types.tsx`, định nghĩa interface cấu hình widget của bạn:

```typescript
export interface YourWidgetConfig extends BaseWidgetConfig {
  type: 'your_widget';
  props?: {
    // Thuộc tính riêng của widget
    unit?: 'celsius' | 'fahrenheit';
    showTrend?: boolean;
    // ... các thuộc tính khác
  };
}
```

## Bước 3: Tạo Widget Component

Tạo widget component trong `YourWidget.tsx`:

```typescript
import React from 'react';
import { BaseWidget, useWidgetFirebase } from './BaseWidget';
import type { YourWidgetConfig, CommonWidgetProps } from './types';

interface YourWidgetProps extends CommonWidgetProps {
  config: YourWidgetConfig;
}

export function YourWidget({ 
  config, 
  editMode, 
  onSettings, 
  onDuplicate, 
  onDelete,
  onError 
}: YourWidgetProps) {
  // Firebase integration
  const {
    firebaseValue,
    connectionStatus,
    firebaseError,
    connectFirebase,
    disconnectFirebase,
    shouldConnect,
    isFirebaseConfigured,
  } = useWidgetFirebase({
    firebasePath: config.firebaseConfig?.path,
    dataType: config.firebaseConfig?.dataType || 'number',
    editMode,
  });

  // Auto-connect when configured and not in edit mode
  useEffect(() => {
    if (shouldConnect && isFirebaseConfigured) {
      connectFirebase();
    } else if (editMode) {
      disconnectFirebase();
    }
  }, [shouldConnect, isFirebaseConfigured, editMode, connectFirebase, disconnectFirebase]);

  // Handle Firebase errors
  useEffect(() => {
    if (firebaseError && onError) {
      onError(firebaseError);
    }
  }, [firebaseError, onError]);

  // Process your data
  const processedValue = React.useMemo(() => {
    if (firebaseValue === null || firebaseValue === undefined) {
      return null;
    }
    // Convert and process your data here
    return Number(firebaseValue);
  }, [firebaseValue]);

  return (
    <BaseWidget
      editMode={editMode}
      onSettings={onSettings}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      firebasePath={config.firebaseConfig?.path}
      connectionStatus={connectionStatus}
      firebaseError={firebaseError}
      className="your-widget-classes"
    >
      {/* Your widget content */}
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium text-gray-700">
          {config.title}
        </h3>
        
        {/* Your widget display logic */}
        <div className="text-2xl font-bold">
          {processedValue !== null ? processedValue : '--'}
        </div>
        
        {/* Status indicators */}
        {!isFirebaseConfigured && (
          <div className="text-xs text-gray-500">
            Chưa cấu hình đường dẫn Firebase
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
```

## Bước 4: Đăng Ký Widget Trong Registry

Thêm widget của bạn vào `registry.tsx`:

```typescript
// Add to WIDGET_CONSTRAINTS_REGISTRY
export const WIDGET_CONSTRAINTS_REGISTRY: Record<WidgetType, WidgetConstraints> = {
  // ... existing widgets
  your_widget: {
    minW: 2,
    maxW: 4,
    minH: 2,
    maxH: 4,
    defaultSize: { w: 2, h: 2 }
  },
};

// Add to WIDGET_METADATA_REGISTRY
export const WIDGET_METADATA_REGISTRY: Record<WidgetType, WidgetMetadata> = {
  // ... existing widgets
  your_widget: {
    name: 'Your Widget',
    description: 'Mô tả widget của bạn',
    icon: YourIcon,
    category: 'display',
    tags: ['your', 'widget', 'tags'],
    difficulty: 'beginner',
    requiredFeatures: ['firebase']
  },
};

// Add to WIDGET_COMPONENT_REGISTRY
const WIDGET_COMPONENT_REGISTRY: Record<WidgetType, React.ComponentType<any>> = {
  // ... existing widgets
  your_widget: YourWidget,
};

// Add to WIDGET_REGISTRY
export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  // ... existing widgets
  your_widget: {
    type: 'your_widget',
    metadata: WIDGET_METADATA_REGISTRY.your_widget,
    constraints: WIDGET_CONSTRAINTS_REGISTRY.your_widget,
    defaultConfig: createDefaultWidgetConfig('your_widget'),
    component: WIDGET_COMPONENT_REGISTRY.your_widget,
  },
};
```

## Bước 5: Tạo Settings Schema

Tạo `YourWidgetSettings.tsx` trong thư mục `settings/`:

```typescript
import { YourIcon, Database } from 'lucide-react';
import type { WidgetSettingsSchema } from './WidgetSettingsFramework';

export const yourWidgetSettingsSchema: WidgetSettingsSchema = {
  sections: [
    // General Settings
    {
      key: 'title',
      type: 'text',
      label: 'Tiêu Đề Widget',
      description: 'Tên hiển thị cho widget của bạn',
      defaultValue: 'Your Widget',
      maxLength: 50,
    },

    // Firebase Configuration
    {
      type: 'section',
      title: 'Cấu Hình Firebase',
      description: 'Cấu hình kết nối nguồn dữ liệu',
      icon: <Database className="w-4 h-4" />,
      fields: [
        {
          key: 'firebaseConfig.path',
          type: 'text',
          label: 'Đường Dẫn Firebase',
          description: 'Đường dẫn đến dữ liệu trong Firebase',
          defaultValue: '/your/data/path',
          required: true,
          placeholder: '/your/data/path',
        },
        {
          key: 'firebaseConfig.updateInterval',
          type: 'number',
          label: 'Khoảng Thời Gian Cập Nhật (ms)',
          description: 'Tần suất lấy dữ liệu mới',
          defaultValue: 1000,
          min: 100,
          max: 60000,
          step: 100,
        },
      ],
    },

    // Your Widget Properties
    {
      type: 'section',
      title: 'Thuộc Tính Widget',
      description: 'Cấu hình tùy chọn hiển thị widget',
      icon: <YourIcon className="w-4 h-4" />,
      fields: [
        {
          key: 'props.unit',
          type: 'select',
          label: 'Đơn Vị Hiển Thị',
          description: 'Đơn vị để hiển thị',
          defaultValue: 'default',
          options: [
            { value: 'default', label: 'Mặc Định' },
            { value: 'custom', label: 'Tùy Chỉnh' },
          ],
        },
        {
          key: 'props.showTrend',
          type: 'boolean',
          label: 'Hiển Thị Xu Hướng',
          description: 'Hiển thị chỉ báo xu hướng',
          defaultValue: true,
        },
      ],
    },
  ],
};
```

## Bước 6: Đăng Ký Settings

Thêm settings của bạn vào `settings/index.tsx`:

```typescript
import { yourWidgetSettingsSchema } from './YourWidgetSettings';

export const WIDGET_SETTINGS_REGISTRY: Record<WidgetType, () => WidgetSettingsSchema> = {
  // ... existing widgets
  your_widget: () => yourWidgetSettingsSchema,
};
```

## Bước 7: Cập Nhật Cấu Hình Mặc Định

Thêm cấu hình mặc định của widget vào `types.tsx` trong hàm `createDefaultWidgetConfig`:

```typescript
case 'your_widget':
  return {
    ...baseConfig,
    type: 'your_widget',
    w: 2,
    h: 2,
    firebaseConfig: {
      path: '/your/data/path',
      dataType: 'number',
      updateInterval: 1000,
      enabled: true,
    },
    props: {
      unit: 'default',
      showTrend: true,
      // ... other default properties
      ...baseConfig.props,
    },
  } as YourWidgetConfig;
```

## Bước 8: Export Widget

Thêm widget của bạn vào `index.tsx`:

```typescript
export { YourWidget } from "./YourWidget";
```

## Khái Niệm Chính

### BaseWidget
Component `BaseWidget` cung cấp:
- Layout và styling chung
- Chỉ báo kết nối Firebase
- Điều khiển chế độ chỉnh sửa (settings, duplicate, delete)
- Xử lý lỗi

### Firebase Integration
Sử dụng hook `useWidgetFirebase` cho:
- Quản lý kết nối tự động
- Chuyển đổi kiểu dữ liệu
- Xử lý lỗi
- Chỉ báo trạng thái kết nối

### Settings Framework
Framework settings cung cấp:
- Tạo form từ schema
- Validation
- Giá trị mặc định
- Hỗ trợ object lồng nhau

### Widget Lifecycle
1. **Creation**: Widget được thêm vào dashboard
2. **Configuration**: Người dùng thiết lập đường dẫn Firebase và thuộc tính
3. **Connection**: Widget kết nối Firebase khi không ở chế độ chỉnh sửa
4. **Data Display**: Widget render dữ liệu với xử lý lỗi
5. **Updates**: Widget nhận cập nhật thời gian thực từ Firebase

## Best Practices

1. **Error Handling**: Luôn xử lý lỗi kết nối Firebase
2. **Loading States**: Hiển thị chỉ báo loading phù hợp
3. **Default Values**: Cung cấp giá trị mặc định hợp lý cho tất cả thuộc tính
4. **Validation**: Validate input người dùng trong settings
5. **Responsive Design**: Đảm bảo widget hoạt động ở các kích thước khác nhau
6. **Accessibility**: Sử dụng ARIA labels và keyboard navigation phù hợp

## Ví Dụ: Temperature Widget

Temperature Widget minh họa tất cả các khái niệm này:

- **Firebase Integration**: Kết nối dữ liệu cảm biến nhiệt độ
- **Data Processing**: Chuyển đổi giá trị và áp dụng chuyển đổi đơn vị
- **Visual Feedback**: Phạm vi nhiệt độ được mã màu
- **Settings**: Đơn vị, độ chính xác và phạm vi màu có thể cấu hình
- **Error Handling**: Hiển thị trạng thái kết nối và lỗi

Điều này cung cấp template hoàn chỉnh để phát triển widget mới trong hệ thống dashboard IoT Kit.