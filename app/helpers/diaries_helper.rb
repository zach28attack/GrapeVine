module DiariesHelper
  def should_display_piechart(piechart_array)
    truthy = false
    piechart_array.each do |macro|
     if macro[1] > 0
      truthy = true 
     end
    end
    truthy
  end
end