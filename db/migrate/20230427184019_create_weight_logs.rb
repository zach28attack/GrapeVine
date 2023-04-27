class CreateWeightLogs < ActiveRecord::Migration[7.0]
  def change
    create_table :weight_logs do |t|
      t.belongs_to :user, index: true
      t.integer :log
      t.timestamps
    end
  end
end
