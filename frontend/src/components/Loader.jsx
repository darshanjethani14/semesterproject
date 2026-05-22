const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-14 w-14' };

  const spinner = (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-4 border-brand-200 border-t-brand-600`}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-8">{spinner}</div>;
};

export default Loader;
