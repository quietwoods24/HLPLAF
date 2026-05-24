package com.example.lab3

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
object DataManager {
    private const val PREFS_NAME = "ShopPrefs"
    private const val USERS_KEY = "users_data"
    private const val CURRENT_USER_KEY = "current_user_email"

    // https://developer.alexanderklimov.ru/android/kotlin/lateinit.php
    // https://metanit.com/java/android/12.1.php
    private lateinit var prefs: SharedPreferences
    private val gson = Gson()

    var currentUser: User? = null
    var usersList = mutableListOf<User>()

    val catalog = listOf(
        Product( 1, "Dog Chow Sensitive", 426.0, "food", R.drawable.img_1),
        Product( 2, "Trixie Denta Fun - іграшка для собак", 109.0, "toys", R.drawable.img_2),
        Product( 3, "Trixie Шлея з повідцем для котів", 175.0, "accessories", R.drawable.img_3),
        Product( 4, "Harley and Cho Dreamer Gray Velvet ", 1990.0, "accessories", R.drawable.img_4),
        Product( 5, "GimCat Вітаміни", 28.0, "hygiene", R.drawable.img_5),
        Product( 6, "Trixie Premium Шлея", 375.0, "accessories", R.drawable.img_6),
        Product( 7, "Cat Chow Sterilised", 21.15, "food", R.drawable.img_7),
        Product( 8, "AnimAll Fun Іграшка кістка", 225.0, "toys", R.drawable.img_8),
        Product( 9, "Trixie «Catch the Light»", 177.0, "electronics", R.drawable.img_9),
        Product( 10, "Trixie Dog Activity Flip", 390.0, "toys", R.drawable.img_10),
        Product( 11, "Say Meow Grace Кігтеточка", 1290.0, "accessories", R.drawable.img_11),
        Product( 12, "Simparica (Сімпаріка)", 363.0, "hygiene", R.drawable.img_12),
        Product( 13, "Georplast GeoJoy Long", 140.0, "hygiene", R.drawable.img_13),
        Product( 14, "Bronzedog Будиночок", 602.0, "accessories", R.drawable.img_14),
        Product( 15, "Клуб 4 Лапи - вологий корм", 13.10, "food", R.drawable.img_15),
        Product( 16, "Dermoscent ATOP 7 Shampoo", 835.0, "accessories", R.drawable.img_16),
        Product( 17, "Barksi Textile", 432.0, "accessories", R.drawable.img_17),
        Product( 18, "Trixie Рукавичка", 143.0, "hygiene", R.drawable.img_18),
        Product( 19, "Bronzedog Urban Шлея з повідцем для собак", 203.0, "accessories", R.drawable.img_19),
        Product( 20, "Delickcious Кремові ласощі", 114.0, "food", R.drawable.img_20)
        )

    fun init(context: Context) {
        // https://metanit.com/java/android/12.1.php
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        loadUsers()
        val savedEmail = prefs.getString(CURRENT_USER_KEY, null)
        if (savedEmail != null) {
            currentUser = usersList.find { it.email == savedEmail }
        }
    }

    private fun loadUsers() {
        val json = prefs.getString(USERS_KEY, null)
        if (json != null) {
            val usersArray = gson.fromJson(json, Array<User>::class.java)
            usersList = usersArray.toMutableList()
        }
    }

    fun saveUsers() {
        currentUser?.let { user ->
            val index = usersList.indexOfFirst { it.email == user.email }
            if (index != -1) {
                usersList[index] = user
            } else {
                usersList.add(user)
            }
        }
        prefs.edit().putString(USERS_KEY, gson.toJson(usersList)).apply()
    }

    fun login(email: String, pass: String): Boolean {
        val user = usersList.find { it.email == email && it.pass == pass }
        if (user != null) {
            currentUser = user
            prefs.edit().putString(CURRENT_USER_KEY, email).apply()
            return true
        }
        return false
    }

    fun register(email: String, pass: String): Boolean {
        if (usersList.any { it.email == email }) {
            return false
        }
        val newUser = User(email, pass)
        usersList.add(newUser)
        currentUser = newUser
        prefs.edit().putString(CURRENT_USER_KEY, email).apply()
        saveUsers()
        return true
    }

    fun logout() {
        currentUser = null
        prefs.edit().remove(CURRENT_USER_KEY).apply()
    }

    fun checkout(phone: String, address: String) {
        if (currentUser?.cart?.isEmpty() == true) {
            return
        }
        val newOrder = Order(
            orderId = (1000..9999).random(),
            items = currentUser!!.cart.toList(),
            phone = phone,
            address = address,
            date = System.currentTimeMillis()
        )
        currentUser?.orders?.add(newOrder)
        currentUser?.cart?.clear()
        saveUsers()
    }

    fun getRecommendations(): List<Product> {
        val userOrders = currentUser?.orders ?: return emptyList()
        if (userOrders.isEmpty()) {
            return emptyList()
        }

        val boughtCategories = userOrders.flatMap { order -> order.items.map { it.category } }
        return catalog.filter { product ->
            boughtCategories.contains(product.category) &&
                    currentUser?.cart?.any { it.id == product.id } == false
        }.take(3)
    }
}