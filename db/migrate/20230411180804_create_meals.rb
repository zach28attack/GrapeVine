class CreateMeals < ActiveRecord::Migration[7.0]
  def change
    create_table :meals do |t|
      t.string :meal_name
      t.belongs_to :user, index: true

      t.timestamps
    end
  end
end
