class CreateFoods < ActiveRecord::Migration[7.0]
  def change
    create_table :foods do |t|
      t.string :food_name
      t.integer :calories
      t.integer :protein
      t.integer :fats
      t.integer :carbs
      t.belongs_to :user, index: true
      t.timestamps
    end
  end
end
