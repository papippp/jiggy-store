
export default function ProductSkeleton() {
  return (
    <div className="product-card skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-body">
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-price" />
                <div className="skeleton-line skeleton-desc" />
                <div className="skeleton-line skeleton-desc short" />
                <div className="skeleton-sizes">
                    <div className="skeleton-size-btn" />
                    <div className="skeleton-size-btn" />
                    <div className="skeleton-size-btn" />
                </div>
                <div className="skeleton-line skeleton-btn" />
            </div>
        </div>
  )
}
