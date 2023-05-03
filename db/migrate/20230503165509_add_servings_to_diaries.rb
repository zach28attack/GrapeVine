class AddServingsToDiaries < ActiveRecord::Migration[7.0]
  def change
    add_column :diaries, :servings, :integer, default: 1
  end
end
