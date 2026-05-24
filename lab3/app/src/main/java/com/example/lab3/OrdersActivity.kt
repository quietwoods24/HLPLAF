package com.example.lab3
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import java.text.SimpleDateFormat
import java.util.Locale

class OrdersActivity : AppCompatActivity() {
    private lateinit var adapter: OrdersAdapter
    private val handler = Handler(Looper.getMainLooper())
    private val updateRunnable = object : Runnable {
        override fun run() {
            if (::adapter.isInitialized) {
                adapter.notifyDataSetChanged()
            }
            handler.postDelayed(this, 1000)
        }
    }

    // https://metanit.com/kotlin/jetpack/19.1.php
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_orders)

        val rvOrders = findViewById<RecyclerView>(R.id.rvOrders)
        val tvNoOrders = findViewById<TextView>(R.id.tvNoOrders)

        val ordersList = DataManager.currentUser?.orders ?: mutableListOf()

        if (ordersList.isEmpty()) {
            tvNoOrders.visibility = View.VISIBLE
            rvOrders.visibility = View.GONE
        } else {
            tvNoOrders.visibility = View.GONE
            rvOrders.visibility = View.VISIBLE

            rvOrders.layoutManager = LinearLayoutManager(this)
            adapter = OrdersAdapter(ordersList)
            rvOrders.adapter = adapter
        }
    }

    override fun onResume() {
        super.onResume()
        handler.post(updateRunnable)
    }

    override fun onPause() {
        super.onPause()
        handler.removeCallbacks(updateRunnable)
    }

    // https://www.youtube.com/watch?v=rcHc0SFspPw
    class OrdersAdapter(private val orders: List<Order>) : RecyclerView.Adapter<OrdersAdapter.OrderVH>() {

        class OrderVH(view: View) : RecyclerView.ViewHolder(view) {
            val tvOrderId: TextView = view.findViewById(R.id.tvOrderId)
            val tvOrderDate: TextView = view.findViewById(R.id.tvOrderDate)
            val tvOrderItems: TextView = view.findViewById(R.id.tvOrderItems)
            val tvOrderContacts: TextView = view.findViewById(R.id.tvOrderContacts)
            val tvOrderStatus: TextView = view.findViewById(R.id.tvOrderStatus)
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderVH {
            // https://stackoverflow.com/questions/72791879/having-difficulty-understanding-layoutinflater-android-studio-kotlin
            val view = LayoutInflater.from(parent.context).inflate(R.layout.item_order, parent, false)
            return OrderVH(view)
        }

        override fun onBindViewHolder(holder: OrderVH, position: Int) {
            val order = orders[position]

            holder.tvOrderId.text = "Замовлення №${order.orderId}"
            // https://medium.com/@buanasatriaa/human-readable-date-format-using-simpledateformat-in-android-76d684093182
            val sdf = SimpleDateFormat("dd.MM.yyyy HH:mm", Locale.getDefault())
            holder.tvOrderDate.text = sdf.format(order.date)

            // https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html
            val itemsText = order.items.joinToString(", ") { it.name }
            holder.tvOrderItems.text = "Товари: $itemsText"
            holder.tvOrderContacts.text = "Телефон: ${order.phone}\nАдреса: ${order.address}"

            // https://proandroiddev.com/write-testable-time-dependent-coroutine-code-in-kotlin-avoid-system-currenttimemillis-fb9b7eb1ddf9
            val timePassedMs = System.currentTimeMillis() - order.date
            val status = when {
                timePassedMs < 10_000 -> "В обробці"
                timePassedMs < 20_000 -> "Комплектується"
                timePassedMs < 30_000 -> "Передано в кур'єрську службу"
                else -> "Доставлено"
            }
            holder.tvOrderStatus.text = "Статус: $status"
        }

        override fun getItemCount(): Int {
            return orders.size
        }
    }
}