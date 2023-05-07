class AddFoodNameToDiaries < ActiveRecord::Migration[7.0]
  def change
    add_column :diaries, :food_name, :string
  end
end
