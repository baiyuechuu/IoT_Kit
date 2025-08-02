import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Base field configuration
export interface BaseFieldConfig {
  key: string;
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
}

// Specific field type configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text';
  placeholder?: string;
  maxLength?: number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: Array<{ value: string; label: string }>;
}

export interface BooleanFieldConfig extends BaseFieldConfig {
  type: 'boolean';
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
}

export interface SectionConfig {
  type: 'section';
  fields: FieldConfig[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export type FieldConfig = 
  | TextFieldConfig 
  | NumberFieldConfig 
  | SelectFieldConfig 
  | BooleanFieldConfig 
  | TextareaFieldConfig;

// Widget settings schema interface
export interface WidgetSettingsSchema {
  sections: (SectionConfig | FieldConfig)[];
}

// Field renderer props
interface FieldRendererProps {
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

// Individual field renderers
function TextFieldRenderer({ field, value, onChange, disabled }: FieldRendererProps & { field: TextFieldConfig }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.key}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        disabled={disabled}
      />
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
}

function NumberFieldRenderer({ field, value, onChange, disabled }: FieldRendererProps & { field: NumberFieldConfig }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.key}
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        disabled={disabled}
      />
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
}

function SelectFieldRenderer({ field, value, onChange, disabled }: FieldRendererProps & { field: SelectFieldConfig }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value || field.defaultValue} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
}

function BooleanFieldRenderer({ field, value, onChange, disabled }: FieldRendererProps & { field: BooleanFieldConfig }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Switch
          id={field.key}
          checked={value || false}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        <Label htmlFor={field.key} className="flex-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      {field.description && (
        <p className="text-xs text-muted-foreground ml-6">{field.description}</p>
      )}
    </div>
  );
}

function TextareaFieldRenderer({ field, value, onChange, disabled }: FieldRendererProps & { field: TextareaFieldConfig }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={field.key}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={field.rows || 3}
        disabled={disabled}
      />
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
}

// Main field renderer component
function FieldRenderer({ field, value, onChange, disabled }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
      return <TextFieldRenderer field={field} value={value} onChange={onChange} disabled={disabled} />;
    case 'number':
      return <NumberFieldRenderer field={field} value={value} onChange={onChange} disabled={disabled} />;
    case 'select':
      return <SelectFieldRenderer field={field} value={value} onChange={onChange} disabled={disabled} />;
    case 'boolean':
      return <BooleanFieldRenderer field={field} value={value} onChange={onChange} disabled={disabled} />;
    case 'textarea':
      return <TextareaFieldRenderer field={field} value={value} onChange={onChange} disabled={disabled} />;
    default:
      return null;
  }
}

// Section renderer component
interface SectionRendererProps {
  section: SectionConfig;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  disabled?: boolean;
}

function SectionRenderer({ section, values, onChange, disabled }: SectionRendererProps) {
  return (
    <div className="space-y-3 border-t pt-4">
      
      <div className="space-y-4">
        {section.fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={(value) => onChange(field.key, value)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

// Main widget settings form component
interface WidgetSettingsFormProps {
  schema: WidgetSettingsSchema;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  disabled?: boolean;
}

export function WidgetSettingsForm({ schema, values, onChange, disabled }: WidgetSettingsFormProps) {
  return (
    <div className="space-y-4">
      {schema.sections.map((item, index) => {
        if ('type' in item && item.type === 'section') {
          return (
            <SectionRenderer
              key={index}
              section={item}
              values={values}
              onChange={onChange}
              disabled={disabled}
            />
          );
        } else {
          return (
            <FieldRenderer
              key={item.key}
              field={item}
              value={values[item.key]}
              onChange={(value) => onChange(item.key, value)}
              disabled={disabled}
            />
          );
        }
      })}
    </div>
  );
}



// Validation helpers
export function validateFields(schema: WidgetSettingsSchema, values: Record<string, any>): string[] {
  const errors: string[] = [];
  
  const validateFieldsRecursive = (fields: FieldConfig[]) => {
    fields.forEach((field) => {
      if (field.required && (!values[field.key] || values[field.key] === '')) {
        errors.push(`${field.label} is required`);
      }
      
      // Type-specific validation
      if (field.type === 'number' && values[field.key] !== undefined) {
        const numValue = Number(values[field.key]);
        if (isNaN(numValue)) {
          errors.push(`${field.label} must be a valid number`);
        } else {
          if (field.min !== undefined && numValue < field.min) {
            errors.push(`${field.label} must be at least ${field.min}`);
          }
          if (field.max !== undefined && numValue > field.max) {
            errors.push(`${field.label} must be at most ${field.max}`);
          }
        }
      }
      
      if (field.type === 'text' && field.maxLength && values[field.key] && values[field.key].length > field.maxLength) {
        errors.push(`${field.label} must be at most ${field.maxLength} characters`);
      }
    });
  };
  
  schema.sections.forEach((item) => {
    if ('type' in item && item.type === 'section') {
      validateFieldsRecursive(item.fields);
    } else {
      validateFieldsRecursive([item]);
    }
  });
  
  return errors;
}

// Default values helper
export function getDefaultValues(schema: WidgetSettingsSchema): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  const extractDefaultsRecursive = (fields: FieldConfig[]) => {
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaults[field.key] = field.defaultValue;
      }
    });
  };
  
  schema.sections.forEach((item) => {
    if ('type' in item && item.type === 'section') {
      extractDefaultsRecursive(item.fields);
    } else {
      extractDefaultsRecursive([item]);
    }
  });
  
  return defaults;
}
