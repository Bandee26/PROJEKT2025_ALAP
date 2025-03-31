using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace AuthApp
{
    public partial class AddDataWindow : Window
    {
        private string selectedTable;
        private readonly List<string> nonIdColumnNames = new List<string>();
        private readonly List<Control> inputControls = new List<Control>();
        private DataGrid dataGrid;
        private StackPanel panel;
        private Dictionary<string, ComboBox> comboBoxes = new Dictionary<string, ComboBox>();

        private TextBox sellerNameTextBox;
        private TextBox sellerPhoneTextBox;
        private TextBox sellerEmailTextBox;

        public AddDataWindow(string tableName, MySqlDataReader reader)
        {
            InitializeComponent();
            selectedTable = tableName;
            panel = new StackPanel();
            bool firstNonIdSkipped = false;

            while (reader.Read())
            {
                string columnName = reader.GetString(0);
                if (!columnName.ToLower().Contains("id"))
                {
                    if (selectedTable.Equals("autok", StringComparison.OrdinalIgnoreCase) && !firstNonIdSkipped)
                    {
                        firstNonIdSkipped = true;
                        continue;
                    }

                    nonIdColumnNames.Add(columnName);
                    Label label = new Label { Content = columnName };
                    Control inputControl;

                    if (IsForeignKey(columnName))
                    {
                        ComboBox comboBox = new ComboBox();
                        LoadForeignKeyData(columnName, comboBox);
                        comboBoxes[columnName] = comboBox;
                        inputControl = comboBox;
                    }
                    else
                    {
                        TextBox textBox = new TextBox();
                        inputControl = textBox;
                    }

                    inputControls.Add(inputControl);
                    panel.Children.Add(label);
                    panel.Children.Add(inputControl);
                }
            }
            reader.Close();

            if (selectedTable.Equals("autok", StringComparison.OrdinalIgnoreCase))
            {
                panel.Children.Add(new Label { Content = "Eladó adatai", FontWeight = FontWeights.Bold });

                panel.Children.Add(new Label { Content = "Név" });
                sellerNameTextBox = new TextBox();
                panel.Children.Add(sellerNameTextBox);

                panel.Children.Add(new Label { Content = "Telefon" });
                sellerPhoneTextBox = new TextBox();
                panel.Children.Add(sellerPhoneTextBox);

                panel.Children.Add(new Label { Content = "Email" });
                sellerEmailTextBox = new TextBox();
                panel.Children.Add(sellerEmailTextBox);
            }

            Button submitButton = new Button { Content = "Hozzáadás" };
            submitButton.Click += SubmitButton_Click;
            panel.Children.Add(submitButton);

            dataGrid = new DataGrid { Margin = new Thickness(10) };
            panel.Children.Add(new Label { Content = "Táblázat tartalma:" });
            panel.Children.Add(dataGrid);

            this.Content = panel;
            RefreshDataGrid();
        }

        private bool IsForeignKey(string columnName)
        {
            return columnName.EndsWith("_ID", StringComparison.OrdinalIgnoreCase);
        }

        private void LoadForeignKeyData(string columnName, ComboBox comboBox)
        {
            string referencedTable = columnName.Replace("_ID", "").ToLower();
            string query = referencedTable switch
            {
                "marka" => "SELECT Marka_ID, Marka FROM markak",
                "szin" => "SELECT Szin_ID, Szin FROM szinek",
                "modell" => "SELECT Modell_ID, Modell FROM modellek",
                "motortipus" => "SELECT Motortipus_ID, Motortipus FROM motortipusok",
                "motorspecifikacio" => "SELECT Motorspecifikacio_ID, Motorspecifikacio FROM motorspecifikaciok",
                "hasznalat" => "SELECT Hasznalat_ID, Hasznalat FROM hasznalat",
                "sebessegvalto" => "SELECT Sebessegvalto_ID, Sebessegvalto FROM sebessegvaltok",
                _ => ""
            };

            if (string.IsNullOrEmpty(query)) return;

            using (MySqlConnection conn = new MySqlConnection("Server=localhost;Database=auto_adatbazis;Uid=root;Pwd=root;"))
            {
                conn.Open();
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        comboBox.Items.Add(new { Id = reader.GetInt32(0), Name = reader.GetString(1) });
                    }
                }
            }

            comboBox.DisplayMemberPath = "Name";
            comboBox.SelectedValuePath = "Id";
        }

        private void SubmitButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                using (MySqlConnection conn = new MySqlConnection("Server=localhost;Database=auto_adatbazis;Uid=root;Pwd=root;"))
                {
                    conn.Open();
                    List<string> columnList = new List<string>();
                    List<string> paramList = new List<string>();
                    MySqlCommand cmd = new MySqlCommand();
                    cmd.Connection = conn;

                    for (int i = 0; i < nonIdColumnNames.Count; i++)
                    {
                        string columnName = nonIdColumnNames[i];
                        columnList.Add(columnName);
                        paramList.Add("@" + columnName);

                        if (comboBoxes.ContainsKey(columnName))
                        {
                            cmd.Parameters.AddWithValue("@" + columnName, (comboBoxes[columnName].SelectedItem as dynamic)?.Id);
                        }
                        else
                        {
                            cmd.Parameters.AddWithValue("@" + columnName, (inputControls[i] as TextBox)?.Text);
                        }
                    }

                    string query = $"INSERT INTO {selectedTable} ({string.Join(", ", columnList)}) VALUES ({string.Join(", ", paramList)})";
                    cmd.CommandText = query;
                    cmd.ExecuteNonQuery();
                }

                MessageBox.Show("Adat sikeresen hozzáadva!");
                RefreshDataGrid();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.Message);
            }
        }

        private void RefreshDataGrid()
        {
            try
            {
                using (MySqlConnection conn = new MySqlConnection("Server=localhost;Database=auto_adatbazis;Uid=root;Pwd=root;"))
                {
                    conn.Open();
                    string selectQuery = $"SELECT * FROM {selectedTable}";
                    MySqlDataAdapter adapter = new MySqlDataAdapter(selectQuery, conn);
                    DataTable dt = new DataTable();
                    adapter.Fill(dt);
                    dataGrid.ItemsSource = dt.DefaultView;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt a táblázat frissítésekor: " + ex.Message);
            }
        }
    }
}
