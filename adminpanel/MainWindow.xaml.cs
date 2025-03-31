using System;
using System.Security.Cryptography;
using System.Text;
using System.Windows;
using MySql.Data.MySqlClient;

namespace AuthApp
{
    public partial class MainWindow : Window
    {
        private const string ConnectionString = "Server=localhost;Database=auto_adatbazis;Uid=root;Pwd=root;";

        public MainWindow()
        {
            InitializeComponent();
        }

        // SHA256 titkosítás: a jelszavak hash-eléséhez
        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        // Regisztráció: beszúrja az adatokat a "dolgozo" táblába
        private void RegisterButton_Click(object sender, RoutedEventArgs e)
        {
            // A regisztrációs felületen:
            // RegisterUsername: email cím,
            // RegisterName: felhasználónév (felhasznalonev),
            // RegisterPassword: jelszó.
            // (A RegisterPhone mezőt nem használjuk, mert a "dolgozo" táblának nincs ilyen oszlopa.)
            string email = RegisterUsername.Text;
            string password = RegisterPassword.Password;
            string name = RegisterName.Text;

            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(name))
            {
                MessageBox.Show("Minden kötelező mezőt ki kell tölteni!");
                return;
            }

            string hashedPassword = HashPassword(password);

            try
            {
                using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                {
                    conn.Open();

                    // Ellenőrizzük, hogy az email már szerepel-e a "dolgozo" táblában
                    string checkQuery = "SELECT COUNT(*) FROM dolgozo WHERE email = @email";
                    MySqlCommand checkCmd = new MySqlCommand(checkQuery, conn);
                    checkCmd.Parameters.AddWithValue("@email", email);
                    int count = Convert.ToInt32(checkCmd.ExecuteScalar());

                    if (count > 0)
                    {
                        MessageBox.Show("Ez az email cím már regisztrálva van. Jelentkezz be!");
                        return;
                    }

                    // Alapértelmezett jogosultság: titkárnő (jogosultsag_id = 2)
                    int defaultRole = 2;

                    string query = "INSERT INTO dolgozo (felhasznalonev, email, jelszo, jogosultsag_id) " +
                                   "VALUES (@name, @email, @password, @role)";
                    MySqlCommand cmd = new MySqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@name", name);
                    cmd.Parameters.AddWithValue("@email", email);
                    cmd.Parameters.AddWithValue("@password", hashedPassword);
                    cmd.Parameters.AddWithValue("@role", defaultRole);
                    cmd.ExecuteNonQuery();

                    MessageBox.Show("Sikeres regisztráció!");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.Message);
            }
        }

        // Bejelentkezés: a "dolgozo" táblából olvassa ki a jelszót, jogosultságot és a felhasználó nevét
        private void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            string email = LoginUsername.Text;
            string password = LoginPassword.Password;

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                MessageBox.Show("Minden mezőt ki kell tölteni!");
                return;
            }

            string hashedPassword = HashPassword(password);

            try
            {
                using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                {
                    conn.Open();
                    // Lekérjük a jelszót, jogosultságot és a felhasználó nevét a "dolgozo" táblából
                    string query = "SELECT jelszo, jogosultsag_id, felhasznalonev FROM dolgozo WHERE email = @email";
                    MySqlCommand cmd = new MySqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@email", email);

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string storedHashedPassword = reader["jelszo"].ToString();
                            int roleId = Convert.ToInt32(reader["jogosultsag_id"]);
                            string username = reader["felhasznalonev"].ToString();

                            // Feltételezzük:
                            // roleId == 1  => admin
                            // roleId == 2  => titkárnő
                            string userRole = roleId == 1 ? "admin" : "titkarno";

                            // Debug: a hash-ek kiírása
                            Console.WriteLine($"Bejegyzett hash: {storedHashedPassword}");
                            Console.WriteLine($"Bejelentkezés hash: {hashedPassword}");

                            if (storedHashedPassword == hashedPassword)
                            {
                                MessageBox.Show("Sikeres bejelentkezés!");

                                // Az AdminPanel konstruktornak átadjuk a felhasználó szerepét
                                AdminPanel adminPanel = new AdminPanel(userRole);
                                adminPanel.Show();
                                this.Close();
                            }
                            else
                            {
                                MessageBox.Show("Hibás email cím vagy jelszó!");
                            }
                        }
                        else
                        {
                            MessageBox.Show("Az email cím nem található!");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.Message);
            }
        }

        private void TabControl_SelectionChanged(object sender, System.Windows.Controls.SelectionChangedEventArgs e)
        {
            // Jelenleg nincs használatban
        }
    }
}
