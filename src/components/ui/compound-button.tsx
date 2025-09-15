import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { type VariantProps } from 'class-variance-authority';

export interface CompoundButtonProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onMainClick?: () => void;
  disabled?: boolean;
  dropdownDisabled?: boolean;
  dropdownItems?: Array<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'default' | 'destructive';
  }>;
  dropdownContent?: React.ReactNode;
  showDropdown?: boolean;
  separator?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

const CompoundButton = React.forwardRef<HTMLDivElement, CompoundButtonProps>(
  (
    {
      children,
      onMainClick,
      disabled = false,
      dropdownDisabled = false,
      dropdownItems = [],
      dropdownContent,
      showDropdown = true,
      separator = true,
      variant = 'default',
      size = 'default',
      className,
      ...props
    },
    ref,
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const handleMainClick = () => {
      if (!disabled && onMainClick) {
        onMainClick();
      }
    };

    const handleDropdownToggle = () => {
      if (!dropdownDisabled) {
        setIsDropdownOpen(!isDropdownOpen);
      }
    };

    const handleDropdownItemClick = (item: (typeof dropdownItems)[0]) => {
      if (!item.disabled) {
        item.onClick();
        setIsDropdownOpen(false);
      }
    };

    const buttonClasses = cn(
      'inline-flex items-center',
      {
        'rounded-l-md': showDropdown && separator,
        'rounded-md': !showDropdown || !separator,
      },
      className,
    );

    const mainButtonClasses = cn(buttonVariants({ variant, size }), {
      'rounded-r-none border-r-1 border-primary-foreground': showDropdown && separator,
      'rounded-md': !showDropdown || !separator,
    });

    const dropdownButtonClasses = cn(
      buttonVariants({ variant, size }),
      'size-9 flex items-center justify-center',
      {
        'rounded-l-none': separator,
        'rounded-md': !separator,
      },
    );

    return (
      <div ref={ref} className={buttonClasses} {...props}>
        <Button
          className={mainButtonClasses}
          onClick={handleMainClick}
          disabled={disabled}
          variant={variant}
          size={size}
        >
          {children}
        </Button>

        {showDropdown && (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                className={dropdownButtonClasses}
                disabled={dropdownDisabled}
                variant={variant}
                size={size}
                onClick={handleDropdownToggle}
                aria-label="Open dropdown menu"
              >
                <ChevronDownIcon
                  className={cn(
                    'size-4 transition-transform duration-200',
                    isDropdownOpen && 'rotate-180',
                  )}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-[160px] dark:border-accent">
              {dropdownContent
                ? dropdownContent
                : dropdownItems.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleDropdownItemClick(item)}
                      disabled={item.disabled}
                      variant={item.variant}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  },
);

CompoundButton.displayName = 'CompoundButton';

export { CompoundButton };
