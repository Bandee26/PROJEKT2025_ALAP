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

            // Lek�rdezz�k a t�bl�hoz tartoz� oszlopokat
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
                    // ID mez� megjelen�t�se, de nem szerkeszthet�
                    Label idLabel = new Label { Content = "ID" };
                    TextBox idTextBox = new TextBox
                    {
                        Text = selectedRow.Row[columnName].ToString(),
                        IsReadOnly = true, // Halv�ny sz�n� �s nem szerkeszthet�
                        Foreground = System.Windows.Media.Brushes.LightGray, // Halv�ny sz�n
                        Background = System.Windows.Media.Brushes.WhiteSmoke // M�g ink�bb jelezze, hogy nem szerkeszthet�
                    };
                    idTextBox.IsTabStop = false; // Ne lehessen f�kusz�lni r�, �s ne lehessen �tugrani
                    MainPanel.Children.Add(idLabel);
                    MainPanel.Children.Add(idTextBox);
                }
            }
            reader.Close();

            // Lek�rdezz�k az els�dleges kulcsot
            GetPrimaryKeyColumn();

            // T�lts�k fel az adatokat a TextBox-okba
            LoadData();

            // Gombok
            Button saveButton = new Button { Content = "M�dos�t�s" };
            saveButton.Click += SaveButton_Click;
            MainPanel.Children.Add(saveButton);

            Button cancelButton = new Button { Content = "M�gse" };
            cancelButton.Click += CancelButton_Click;
            MainPanel.Children.Add(cancelButton);
        }

        // Az els�dleges kulcs lek�rdez�se
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

                    MessageBox.Show("Adat sikeresen m�dos�tva!");

                    this.DialogResult = true;
                    this.Close();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba t�rt�nt: " + ex.ToString());
            }
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
    }
}
