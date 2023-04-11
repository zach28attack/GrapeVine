class CreateDiaries < ActiveRecord::Migration[7.0]
  def change
    create_table :diaries do |t|
      t.belongs_to :user, index: true
      t.integer :calories
      t.integer :protein
      t.integer :fats
      t.integer :carbs
      t.string :time_of_day
      t.timestamps
    end
  end
end
