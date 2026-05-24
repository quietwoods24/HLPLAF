package com.example.lab3

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView

class CartActivity : AppCompatActivity() {
    private lateinit var adapter: CartAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cart)

        val rec_view_cart = findViewById<RecyclerView>(R.id.rec_view_cart)
        val btn_checkout = findViewById<Button>(R.id.btn_checkout)
        val tewx_view_total = findViewById<TextView>(R.id.tewx_view_total)

        // https://www.geeksforgeeks.org/kotlin/android-recyclerview-using-gridlayoutmanager-with-kotlin/
        rec_view_cart.layoutManager = GridLayoutManager(this, 3)

        val cartItems = DataManager.currentUser?.cart ?: mutableListOf()

        fun updateTotal() {
            var sum = 0.0
            val items = DataManager.currentUser?.cart

            if (items != null) {
                for (item in items) {
                    sum += item.price
                }
            }
            tewx_view_total.text = "Разом: $sum грн"
        }

        adapter = CartAdapter(cartItems, object : OnCartClickListener {
            override fun onRemove(product: Product) {
                val position = cartItems.indexOf(product)
                if (position != -1) {
                    DataManager.currentUser?.cart?.removeAt(position)
                    DataManager.saveUsers()
                    adapter.notifyItemRemoved(position)
                    updateTotal()
                }
            }

            override fun onToggleFavorite(product: Product) {
                val user = DataManager.currentUser
                if (user != null) {
                    val wishlist = user.wishlist

                    if (wishlist.contains(product.id)) {
                        wishlist.remove(product.id)
                    } else {
                        wishlist.add(product.id)
                    }

                    DataManager.saveUsers()
                    val position = cartItems.indexOf(product)
                    if (position != -1) {
                        adapter.notifyItemChanged(position)
                    }
                }
            }
        })

        rec_view_cart.adapter = adapter
        updateTotal()

        btn_checkout.setOnClickListener {
            if (cartItems.isEmpty()) {
                Toast.makeText(this, "Ваш кошик порожній", Toast.LENGTH_SHORT).show()
            } else {
                val intent = Intent(this, CheckoutActivity::class.java)
                startActivity(intent)
            }
        }
    }
}