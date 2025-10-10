module LayoutHelper
  def centered_layout(&block)
    content_tag(:div, data: { controller: "center-content" }, class: "min-h-screen flex items-center justify-center bg-[var(--clr-surface-a10)] overflow-hidden", &block)
  end
end
