# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_05_03_173543) do
  create_table "diaries", force: :cascade do |t|
    t.integer "user_id"
    t.integer "calories"
    t.integer "protein"
    t.integer "fats"
    t.integer "carbs"
    t.string "time_of_day"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "meal_id"
    t.integer "food_id"
    t.date "date"
    t.integer "servings", default: 1
    t.index ["user_id"], name: "index_diaries_on_user_id"
  end

  create_table "foods", force: :cascade do |t|
    t.string "food_name"
    t.integer "calories"
    t.integer "protein"
    t.integer "fats"
    t.integer "carbs"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_foods_on_user_id"
  end

  create_table "foods_meals", force: :cascade do |t|
    t.integer "meal_id"
    t.integer "food_id"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "servings", default: 1
    t.index ["food_id"], name: "index_foods_meals_on_food_id"
    t.index ["meal_id"], name: "index_foods_meals_on_meal_id"
    t.index ["user_id"], name: "index_foods_meals_on_user_id"
  end

  create_table "meals", force: :cascade do |t|
    t.string "meal_name"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_meals_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "weight_logs", force: :cascade do |t|
    t.integer "user_id"
    t.integer "log"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_weight_logs_on_user_id"
  end

end
