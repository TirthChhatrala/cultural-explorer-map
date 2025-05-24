
import React from 'react';
import { Button as ShadcnButton } from './button';
import { cn } from '@/lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface UnifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const UnifiedButton = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  className,
  disabled,
  children,
  onClick,
  ...props 
}: UnifiedButtonProps) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-india-orange hover:bg-india-orange/90 text-white border-transparent';
      case 'secondary':
        return theme === 'dark' 
          ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300';
      case 'outline':
        return theme === 'dark'
          ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'ghost':
        return 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800';
      case 'destructive':
        return 'bg-red-500 hover:bg-red-600 text-white border-transparent';
      default:
        return 'bg-india-orange hover:bg-india-orange/90 text-white border-transparent';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'border',
        getVariantStyles(),
        getSizeStyles(),
        isLoading && 'cursor-not-allowed opacity-75',
        className
      )}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
