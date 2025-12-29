import React from 'react';
import { 
    HiEye, 
    HiPencil, 
    HiTrash, 
    HiClipboardCopy, 
    HiPlay, 
    HiPause,
    HiUpload,
    HiSave,
    HiCamera,
    HiFolder,
    HiPlus,
    HiX
} from 'react-icons/hi';

// Standardized icon sizes
const ICON_SIZE = 18;

// Base button styles
const baseButtonStyles = `
    inline-flex items-center justify-center gap-1.5
    px-3 py-2 rounded-md text-sm font-medium
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
    cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
`;

// Button variants
const variants = {
    view: {
        bg: 'bg-[#1a1a1a] hover:bg-[#3a3a3a]',
        text: 'text-[#d4a853]',
        ring: 'focus:ring-[#d4a853]'
    },
    edit: {
        bg: 'bg-[#d4a853] hover:bg-[#c49743]',
        text: 'text-black',
        ring: 'focus:ring-[#d4a853]'
    },
    copy: {
        bg: 'bg-[#d4a853] hover:bg-[#c49743]',
        text: 'text-black',
        ring: 'focus:ring-[#d4a853]'
    },
    delete: {
        bg: 'bg-red-600 hover:bg-red-700',
        text: 'text-white',
        ring: 'focus:ring-red-500'
    },
    primary: {
        bg: 'bg-[#d4a853] hover:bg-[#c49743]',
        text: 'text-black',
        ring: 'focus:ring-[#d4a853]'
    },
    secondary: {
        bg: 'bg-gray-600 hover:bg-gray-700',
        text: 'text-white',
        ring: 'focus:ring-gray-500'
    },
    success: {
        bg: 'bg-green-600 hover:bg-green-700',
        text: 'text-white',
        ring: 'focus:ring-green-500'
    },
    warning: {
        bg: 'bg-yellow-600 hover:bg-yellow-700',
        text: 'text-black',
        ring: 'focus:ring-yellow-500'
    },
    outline: {
        bg: 'bg-transparent border border-gray-600 hover:bg-[#3a3a3a]',
        text: 'text-white',
        ring: 'focus:ring-gray-500'
    },
    outlineDanger: {
        bg: 'bg-transparent border border-red-500 hover:bg-red-900/30',
        text: 'text-red-400',
        ring: 'focus:ring-red-500'
    }
};

// Icon mapping
const icons = {
    view: HiEye,
    edit: HiPencil,
    delete: HiTrash,
    copy: HiClipboardCopy,
    activate: HiPlay,
    deactivate: HiPause,
    upload: HiUpload,
    save: HiSave,
    camera: HiCamera,
    folder: HiFolder,
    add: HiPlus,
    close: HiX
};

/**
 * Standardized Action Button Component
 * @param {string} icon - Icon type: 'view' | 'edit' | 'delete' | 'copy' | 'activate' | 'deactivate' | 'upload' | 'save' | 'camera' | 'folder' | 'add' | 'close'
 * @param {string} variant - Button variant: 'view' | 'edit' | 'copy' | 'delete' | 'primary' | 'secondary' | 'success' | 'warning' | 'outline' | 'outlineDanger'
 * @param {string} label - Button text (optional, for icon-only buttons)
 * @param {boolean} iconOnly - Show only icon without label
 * @param {string} size - Button size: 'sm' | 'md' | 'lg'
 * @param {function} onClick - Click handler
 * @param {string} title - Tooltip text for accessibility
 * @param {boolean} disabled - Disabled state
 */
export const ActionButton = ({
    icon,
    variant = 'primary',
    label,
    iconOnly = false,
    size = 'md',
    onClick,
    title,
    disabled = false,
    className = '',
    type = 'button',
    ...props
}) => {
    const IconComponent = icons[icon];
    const variantStyles = variants[variant] || variants.primary;
    
    const sizeStyles = {
        sm: 'px-2 py-1.5 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base'
    };
    
    const iconSizes = {
        sm: 14,
        md: ICON_SIZE,
        lg: 20
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            title={title || label}
            aria-label={title || label}
            className={`
                ${baseButtonStyles}
                ${variantStyles.bg}
                ${variantStyles.text}
                ${variantStyles.ring}
                ${sizeStyles[size]}
                ${iconOnly ? 'px-2!' : ''}
                ${className}
            `.trim()}
            {...props}
        >
            {IconComponent && <IconComponent size={iconSizes[size]} />}
            {!iconOnly && label && <span>{label}</span>}
        </button>
    );
};

// Preset action buttons for common actions

export const ViewButton = ({ onClick, label = 'View', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="view"
        variant="view"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="View details"
        {...props}
    />
);

export const EditButton = ({ onClick, label = 'Edit', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="edit"
        variant="edit"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="Edit item"
        {...props}
    />
);

export const DeleteButton = ({ onClick, label = 'Delete', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="delete"
        variant="delete"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="Delete item"
        {...props}
    />
);

export const CopyButton = ({ onClick, label = 'Copy', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="copy"
        variant="copy"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="Copy to clipboard"
        {...props}
    />
);

export const ActivateButton = ({ onClick, label = 'Activate', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="activate"
        variant="success"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="Activate item"
        {...props}
    />
);

export const DeactivateButton = ({ onClick, label = 'Deactivate', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="deactivate"
        variant="warning"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="Deactivate item"
        {...props}
    />
);

export const UploadButton = ({ onClick, label = 'Upload', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="upload"
        variant="primary"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="Upload file"
        {...props}
    />
);

export const SaveButton = ({ onClick, label = 'Save', iconOnly = false, size = 'md', type = 'submit', ...props }) => (
    <ActionButton
        icon="save"
        variant="primary"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        type={type}
        title="Save changes"
        {...props}
    />
);

export const AddButton = ({ onClick, label = 'Add', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="add"
        variant="primary"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="Add new item"
        {...props}
    />
);

export const CancelButton = ({ onClick, label = 'Cancel', iconOnly = false, size = 'md', ...props }) => (
    <ActionButton
        icon="close"
        variant="secondary"
        label={label}
        iconOnly={iconOnly}
        size={size}
        onClick={onClick}
        title="Cancel"
        {...props}
    />
);

// Action button group for consistent spacing
export const ActionButtonGroup = ({ children, className = '' }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        {children}
    </div>
);

export default ActionButton;
