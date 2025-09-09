import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type InputProps = {
  // Дополнительные свойства, если нужны, например, для вариантов стилей
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    const baseClasses = 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

    return (
      <input
        type={type}
        className={clsx(baseClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };