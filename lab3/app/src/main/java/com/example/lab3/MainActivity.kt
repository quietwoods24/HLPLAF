package com.example.lab3

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity

import android.content.Intent
import android.widget.Button
import android.widget.EditText
import android.widget.Toast

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        DataManager.init(this)

        if (DataManager.currentUser != null) {
            startActivity(Intent(this, CatalogActivity::class.java))
            finish()
        }

        val edit_text_email = findViewById<EditText>(R.id.edit_text_email)
        val edit_text_pass = findViewById<EditText>(R.id.edit_text_pass)
        val btn_login = findViewById<Button>(R.id.btn_login)
        val btn_reg = findViewById<Button>(R.id.btn_reg)

        btn_login.setOnClickListener {
            if (DataManager.login(edit_text_email.text.toString(), edit_text_pass.text.toString())) {
                startActivity(Intent(this, CatalogActivity::class.java))
                finish()
            } else {
                Toast.makeText(this, "Невірний логін або пароль", Toast.LENGTH_SHORT).show()
            }
        }

        btn_reg.setOnClickListener {
            if (edit_text_email.text.toString().isNotEmpty() && edit_text_pass.text.toString().isNotEmpty()) {
                if (DataManager.register(edit_text_email.text.toString(), edit_text_pass.text.toString())) {
                    startActivity(Intent(this, CatalogActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(this, "Користувач вже існує", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(this, "Заповніть поля", Toast.LENGTH_SHORT).show()
            }
        }
    }
}