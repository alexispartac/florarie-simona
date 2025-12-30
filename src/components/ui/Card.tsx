import { FC, ReactNode, ElementType } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  hoverEffect?: boolean;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const Card: FC<CardProps> & {
  Header: FC<CardHeaderProps>;
  Title: FC<CardTitleProps>;
  Description: FC<CardDescriptionProps>;
  Content: FC<CardContentProps>;
  Footer: FC<CardFooterProps>;
} = ({ 
  children, 
  className, 
  as: Component = 'div',
  hoverEffect = false,
  ...props 
}) => {
  return (
    <Component
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        hoverEffect && 'transition-all hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

const CardHeader: FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
    {children}
  </div>
);

const CardTitle: FC<CardTitleProps> = ({ 
  children, 
  className, 
  as: Component = 'h3' 
}) => (
  <Component className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
    {children}
  </Component>
);

const CardDescription: FC<CardDescriptionProps> = ({ children, className }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

const CardContent: FC<CardContentProps> = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
);

const CardFooter: FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('flex items-center p-6 pt-0', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
