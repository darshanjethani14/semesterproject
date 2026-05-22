const ProductSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card overflow-hidden">
        <div className="skeleton aspect-square w-full" />
        <div className="space-y-3 p-4">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-6 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export default ProductSkeleton;
