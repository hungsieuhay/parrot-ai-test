import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  line?: boolean;
}

export const Skeleton = ({ className, line = false }: SkeletonProps) => {
  return (
    <div
      className={clsx(
        'size-10 animate-pulse rounded bg-gray-100/20',
        line && 'h-4 w-full',
        className
      )}
    />
  );
};
