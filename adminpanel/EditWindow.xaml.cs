using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Windows;
using System.Windows.Controls;

namespace AuthApp
{
    public partial class EditWindow : Window
    {
        private string selectedTable;
        private readonly List<string> nonIdColumnNames = new List<string>();
        private readonly List<TextBox> textBoxes = new List<TextBox>();
        private DataRowView selectedRow;
        private string primaryKeyColumn;

        public EditWindow(string tableName, MySqlDataReader reader, DataRowView row)
        {
            InitializeComponent();
            selectedTable = tableName;
            selectedRow = row;

            // Lekérdezzük a táblához tartozó oszlopokat
            while (reader.Read())
            {
                string columnName = reader.GetString(0);
                if (columnName.ToLower() != "id")
                {
                    nonIdColumnNames.Add(columnName);
                    Label label = new Label { Content = columnName };
                    TextBox textBox = new TextBox();
                    textBoxes.Add(textBox);
                    MainPanel.Children.Add(label);
                    MainPanel.Children.Add(textBox);
                }
                else
                {
                    // ID mezõ megjelenítése, de nem szerkeszthetõ
                    Label idLabel = new Label { Content = "ID" };
                    TextBox idTextBox = new TextBox
                    {
                        Text = selectedRow.Row[columnName].ToString(),
                        IsReadOnly = true, // Halvány színû és nem szerkeszthetõ
                        Foreground = System.Windows.Media.Brushes.LightGray, // Halvány szín
                        Background = System.Windows.Media.Brushes.WhiteSmoke // Még inkább jelezze, hogy nem szerkeszthetõ
                    };
                    idTextBox.IsTabStop = false; // Ne lehessen fókuszálni rá, és ne lehessen átugrani
                    MainPanel.Children.Add(idLabel);
                    MainPanel.Children.Add(idTextBox);
                }
            }
            reader.Close();

            // Lekérdezzük az elsõdleges kulcsot
            GetPrimaryKeyColumn();

            // Töltsük fel az adatokat a TextBox-okba
            LoadData();

            // Gombok
            Button saveButton = new Button { Content = "Módosítás" };
            saveButton.Click += SaveButton_Click;
            MainPanel.Children.Add(saveButton);

            Button cancelButton = new Button { Content = "Mégse" };
            cancelButton.Click += CancelButton_Click;
            MainPanel.Children.Add(cancelButton);
        }

        // Az elsõdleges kulcs lekérdezése
        private void GetPrimaryKeyColumn()
        {
            using (MySqlConnection conn = new MySqlConnection("Server=localhost;Database=auto_adatbazis;Uid=root;Pwd=root;"))
            {
                conn.Open();
                string query = $"SHOW KEYS FROM {selectedTable} WHERE Key_name = 'PRIMARY'";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    primaryKeyColumn = reader.GetString("Column_name");
                }
                reader.Close();
            }
        }

        private void LoadData()
        {
            for (int i = 0; i < nonIdColumnNames.Count; i++)
            {
                string columnName = nonIdColumnNames[i];
                textBoxes[i].Text = selectedRow.Row[columnName].ToString();
            }
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                using (MySqlConnection conn = new MySqlConnection("Server=localhost;Database=auto_adatbazis;Uid=root;Pwd=root;"))
                {
                    conn.Open();
                    string setClauses = "";
                    for (int i = 0; i < nonIdColumnNames.Count; i++)
                    {
                        setClauses += $"{nonIdColumnNames[i]} = @{nonIdColumnNames[i]}, ";
                    }
                    setClauses = setClauses.TrimEnd(',', ' ');

                    string query = $"UPDATE {selectedTable} SET {setClauses} WHERE `{primaryKeyColumn}` = @id";
                    MySqlCommand cmd = new MySqlCommand(query, conn);
                    for (int i = 0; i < nonIdColumnNames.Count; i++)
                    {
                        cmd.Parameters.AddWithValue($"@{nonIdColumnNames[i]}", textBoxes[i].Text);
                    }
                    cmd.Parameters.AddWithValue("@id", selectedRow.Row[primaryKeyColumn]);

                    cmd.ExecuteNonQuery();

                    MessageBox.Show("Adat sikeresen módosítva!");

                    this.DialogResult = true;
                    this.Close();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.ToString());
            }
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
    }
}
