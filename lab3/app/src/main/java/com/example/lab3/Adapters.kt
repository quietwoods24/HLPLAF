package com.example.lab3

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

// https://kotlinlang.org/docs/interfaces.html#properties-in-interfaces
interface OnCatalogClickListener {
    fun onAddToCart(product: Product)
    fun onToggleFavorite(product: Product)
}

interface OnCartClickListener {
    fun onRemove(product: Product)
    fun onToggleFavorite(product: Product)
}

class CatalogAdapter(
    private val items: List<Product>,
    private val listener: OnCatalogClickListener
) : RecyclerView.Adapter<CatalogAdapter.VH>() {

    class VH(view: View) : RecyclerView.ViewHolder(view) {
        val img_view_product: ImageView = view.findViewById(R.id.img_view_product)
        val text_view_name: TextView = view.findViewById(R.id.text_view_name)
        val text_view_price: TextView = view.findViewById(R.id.text_view_price)
        val btn_add: Button = view.findViewById(R.id.btn_add)
        val btn_fav: ImageView = view.findViewById(R.id.btn_fav)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val inflater = LayoutInflater.from(parent.context)
        val view = inflater.inflate(R.layout.item_product, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]

        holder.text_view_name.text = item.name
        holder.text_view_price.text = item.price.toString() + " грн"
        holder.img_view_product.setImageResource(item.imageResId)

        val user = DataManager.currentUser
        if (user != null && user.wishlist.contains(item.id)) {
            // https://www.geeksforgeeks.org/kotlin/dynamic-imageview-in-kotlin/
            holder.btn_fav.setImageResource(R.drawable.ic_heart_filled)
        } else {
            holder.btn_fav.setImageResource(R.drawable.ic_heart_border)
        }

        holder.btn_add.setOnClickListener {
            listener.onAddToCart(item)
        }

        holder.btn_fav.setOnClickListener {
            listener.onToggleFavorite(item)
        }
    }

    override fun getItemCount(): Int {
        return items.size
    }
}

class CartAdapter(
    private val items: List<Product>,
    private val listener: OnCartClickListener
) : RecyclerView.Adapter<CartAdapter.VH>() {

    class VH(view: View) : RecyclerView.ViewHolder(view) {
        val img_view_product: ImageView = view.findViewById(R.id.img_view_product)
        val text_view_name: TextView = view.findViewById(R.id.text_view_name)
        val text_view_price: TextView = view.findViewById(R.id.text_view_price)
        val btn_remove: Button = view.findViewById(R.id.btn_remove)
        val btn_fav: ImageView = view.findViewById(R.id.btn_fav)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val inflater = LayoutInflater.from(parent.context)
        val view = inflater.inflate(R.layout.item_cart, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]

        holder.text_view_name.text = item.name
        holder.text_view_price.text = item.price.toString() + " грн"
        holder.img_view_product.setImageResource(item.imageResId)

        val user = DataManager.currentUser
        if (user != null && user.wishlist.contains(item.id)) {
            holder.btn_fav.setImageResource(R.drawable.ic_heart_filled)
        } else {
            holder.btn_fav.setImageResource(R.drawable.ic_heart_border)
        }

        holder.btn_remove.setOnClickListener {
            listener.onRemove(item)
        }

        holder.btn_fav.setOnClickListener {
            listener.onToggleFavorite(item)
        }
    }

    override fun getItemCount(): Int {
        return items.size
    }
}