package com.example.lab3

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView

class CatalogActivity : AppCompatActivity() {
    private lateinit var adapter: CatalogAdapter
    private lateinit var text_view_recs: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_catalog)

        val rec_view_catalog = findViewById<RecyclerView>(R.id.rec_view_catalog)
        val btn_cart = findViewById<Button>(R.id.btn_cart)
        val btn_orders = findViewById<Button>(R.id.btn_orders)
        val btn_logout = findViewById<Button>(R.id.btn_logout)

        text_view_recs = findViewById<TextView>(R.id.tvRecommendations)

        rec_view_catalog.setHasFixedSize(true)
        rec_view_catalog.layoutManager = GridLayoutManager(this, 3)

        adapter = CatalogAdapter(DataManager.catalog, object : OnCatalogClickListener {

            override fun onAddToCart(product: Product) {
                DataManager.currentUser?.cart?.add(product)
                DataManager.saveUsers()
                Toast.makeText(this@CatalogActivity, "Додано в кошик", Toast.LENGTH_SHORT).show()
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
                    val position = DataManager.catalog.indexOf(product)
                    if (position != -1) {
                        adapter.notifyItemChanged(position)
                    }
                }
            }
        })

        rec_view_catalog.adapter = adapter

        btn_cart.setOnClickListener {
            val intent = Intent(this, CartActivity::class.java)
            startActivity(intent)
        }

        btn_orders.setOnClickListener {
            val intent = Intent(this, OrdersActivity::class.java)
            startActivity(intent)
        }

        btn_logout.setOnClickListener {
            DataManager.logout()
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }

    override fun onResume() {
        super.onResume()
        adapter.notifyDataSetChanged()

        val recs = DataManager.getRecommendations()
        if (recs.isNotEmpty()) {
            text_view_recs.text = "Рекомендації для вас: " + recs.joinToString { it.name }
        } else {
            text_view_recs.text = "Замовте щось для отримання рекомендацій"
        }
    }
}