package com.example.pw3

import android.os.Bundle
import android.widget.*
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

// https://kotlinlang.org/docs/data-classes.html
data class Movie(val name: String, val genre: String, val rating: Double)

data class FitnessActivity(val type: String, val time: Int)

// https://kotlinlang.org/docs/classes.html#creating-instances
class MainActivity : AppCompatActivity() {
    private val fitness_list = mutableListOf<FitnessActivity>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        // https://stackoverflow.com/questions/68780219/reference-xml-elements-directly-in-kotlin
        val c_n1 = findViewById<EditText>(R.id.calc_n1)
        val c_n2 = findViewById<EditText>(R.id.calc_n2)
        val c_res = findViewById<TextView>(R.id.calc_res)

        val b_plus = findViewById<Button>(R.id.btn_plus)
        val b_min = findViewById<Button>(R.id.btn_min)
        val b_mult = findViewById<Button>(R.id.btn_mult)
        val b_div = findViewById<Button>(R.id.btn_div)

        val a_name = findViewById<EditText>(R.id.act_name)
        val a_time = findViewById<EditText>(R.id.act_time)
        val b_add_act = findViewById<Button>(R.id.btn_add_act)
        val f_stat = findViewById<TextView>(R.id.fitness_stat)

        val m_list = findViewById<TextView>(R.id.movies_list)
        val movies = listOf(
            Movie("Home", "comedy", 10.0),
            Movie("After Earth", "action-adventure", 9.0),
            Movie("I, Robot", "science fiction", 9.6),
            Movie("Spirited Away", "fantasy", 8.0)
        )

        // https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-string-builder/
        val m_disp = StringBuilder()
        for (m in movies) {
            m_disp.append("${m.name}, ${m.genre}, ${m.rating}\n")
        }

        m_list.text = m_disp.toString()



        fun calculate(operation: String) {
            // https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-double-or-null.html
            val n1 = c_n1.text.toString().toDoubleOrNull()
            val n2 = c_n2.text.toString().toDoubleOrNull()

            if (n1 == null || n2 == null) {
                Toast.makeText(this, "Введіть коректні числа", Toast.LENGTH_SHORT).show()
                return
            }

            // https://stackoverflow.com/questions/53138172/how-to-implement-switch-case-statement-in-kotlin
            val res = when (operation) {
                "+" -> n1 + n2
                "-" -> n1 - n2
                "*" -> n1 * n2
                "/" ->
                    if (n2 != 0.0) {
                        n1 / n2
                    }
                    else {
                        null
                    }
                else -> 0.0
            }
            if (res == null) {
                c_res.text = "Помилка: ділення на 0"
            } else {
                // https://stackoverflow.com/questions/23086291/kotlin-string-formatting
                c_res.text = "Результат: %.2f".format(res)
            }
        }

        // https://stackoverflow.com/questions/56749461/how-to-set-an-onclicklistener-to-a-button-in-kotlin
        b_plus.setOnClickListener { calculate("+") }
        b_min.setOnClickListener  { calculate("-") }
        b_mult.setOnClickListener { calculate("*") }
        b_div.setOnClickListener  { calculate("/") }



        b_add_act.setOnClickListener {
            // https://www.tutorialspoint.com/kotlin/kotlin_string_trim_function.htm
            val type = a_name.text.toString().trim()
            // https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-int-or-null.html
            val time = a_time.text.toString().toIntOrNull()

            // https://stackoverflow.com/questions/45336954/checking-if-string-is-empty-in-kotlin
            if (type.isNotEmpty() && time != null) {
                fitness_list.add(FitnessActivity(type, time))

                // https://stackoverflow.com/questions/52851161/how-do-i-sum-all-the-items-of-a-list-of-integers-in-kotlin
                val total_min = fitness_list.sumOf { it.time }
                val count = fitness_list.size

                // https://stackoverflow.com/questions/35522590/take-last-n-element-in-kotlin
                val last_act = fitness_list.takeLast(5).asReversed().joinToString("\n") {
                    "${it.type}: ${it.time} хв"
                }

                // https://stackoverflow.com/questions/65294629/kotlin-string-concatenation-preserving-indents-with-multiline-strings
                val full_text = """
Кількіть ренувань: $count
Загальний час: $total_min хв
                    
Останні тренування:
$last_act
""".trimIndent()

                f_stat.text = full_text
                a_name.text.clear()
                a_time.text.clear()
            } else {
                Toast.makeText(this, "Введіть назву та час", Toast.LENGTH_SHORT).show()
            }
        }
    }
}