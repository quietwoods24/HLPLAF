package com.example.lab3

// https://kotlinlang.org/docs/data-classes.html#data-classes-and-destructuring-declarations
data class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val category: String,
    val imageResId: Int,
    var isFavorite: Boolean = false
)

data class Order(
    val orderId: Int,
    val items: List<Product>,
    val phone: String,
    val address: String,
    val date: Long
)

data class User(
    val email: String,
    val pass: String,
    var cart: MutableList<Product> = mutableListOf(),
    var orders: MutableList<Order> = mutableListOf(),
    var wishlist: MutableList<Int> = mutableListOf()
)