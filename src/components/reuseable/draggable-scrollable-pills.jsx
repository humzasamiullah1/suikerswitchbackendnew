import { useState, useRef, useEffect } from "react"

// Helper function to conditionally join classNames
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function DraggableScrollablePills({ items, className, onPillClick, isActive }) {
  const [activeId, setActiveId] = useState(items[0]?.id || null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const containerRef = useRef(null)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const handlePillClick = (item, event) => {
    // Only trigger click if we're not dragging
    if (!isDragging) {
      setActiveId(item.id)
      onPillClick?.(item)
    }
    event.preventDefault()
  }

  const handleMouseDown = (e) => {
    if (!containerRef.current) return

    setIsMouseDown(true)
    setIsDragging(false)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isMouseDown || !containerRef.current) return

    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk

    // If we've moved more than a few pixels, consider it a drag
    if (Math.abs(x - startX) > 5) {
      setIsDragging(true)
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
    // Reset dragging state after a short delay to allow click events
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }

  const handleTouchStart = (e) => {
    if (!containerRef.current) return

    setIsMouseDown(true)
    setIsDragging(false)
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleTouchMove = (e) => {
    if (!isMouseDown || !containerRef.current) return

    const x = e.touches[0].pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk

    if (Math.abs(x - startX) > 5) {
      setIsDragging(true)
    }
  }

  useEffect(() => {
    // Add mouse leave event listener to the document
    const handleMouseLeave = () => {
      setIsMouseDown(false)
    }

    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
        isMouseDown ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div className="flex flex-row gap-2 p-2 min-w-max select-none">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={(e) => handlePillClick(item, e)}
            className={cn(
              "px-4 py-1 rounded-full text-xs lg:text-sm font-HelveticaNeueRegular transition-colors whitespace-nowrap",
              " focus:outline-none focus:ring-2 focus:ring-gray-200",
              isActive === item.label ? "bg-gkRedColor text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
