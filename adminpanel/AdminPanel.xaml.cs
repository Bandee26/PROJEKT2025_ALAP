using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.IO;
using System.Windows.Media.Imaging;

namespace AuthApp
{
    public partial class AdminPanel : Window
    {
        private const string ConnectionString = "Server=localhost;Database=auto_adatbazis;Uid=root;Pwd=root;";
        private MySqlDataAdapter adapter;
        private DataTable table;
        private bool isCurrentView = false; // jelzi, hogy jelenleg view-t toltunk-e be
        private string userRole; // Felhasznalo jogosultsaganak tarolasa ("admin" vagy "titkarno")

        // Mezo a jelenleg kivaltott auto azonositoja es a kep sorszama
        private int currentCarId = 0;
        private int currentImageIndex = 1;
        private static readonly string ImageFolder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "IMG");

        // Konstruktor, amely fogadja a felhasznalo szerepet
        public AdminPanel(string role)
        {
            InitializeComponent();
            userRole = role;

            if (TestDatabaseConnection())
            {
                LoadTables();
            }

            // Ha a bejelentkezett felhasznalo nem admin, letiltjuk a torles gombot.
            if (userRole != "admin")
            {
                DeleteButton.IsEnabled = false;
            }

            // DataGrid sor valasztas esemenyenek kezelese, hogy a kivalasztott autohoz tartozo kepet betolthassuk
            CarDataGrid.SelectionChanged += CarDataGrid_SelectionChanged;
        }

        // Parameter nelkuli konstruktor, alapertelmezett szereppel (titkarno)
        public AdminPanel() : this("titkarno")
        {
        }

        // Adatbazis kapcsolat tesztelese
        private bool TestDatabaseConnection()
        {
            try
            {
                using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                {
                    conn.Open();
                    MessageBox.Show("Kapcsolat sikeresen letrejott az adatbazissal.");
                    return true;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba tortent a kapcsolat letrehozasakor: " + ex.Message);
                return false;
            }
        }

        // Tablak es nezetek betoltese a ComboBox-ba
        private void LoadTables()
        {
            try
            {
                using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                {
                    conn.Open();
                    string query = "SHOW FULL TABLES WHERE Table_Type = 'BASE TABLE' OR Table_Type = 'VIEW';";
                    MySqlCommand cmd = new MySqlCommand(query, conn);
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        string tableName = reader.GetString(0);
                        string tableType = reader.GetString(1); // "BASE TABLE" vagy "VIEW"
                        if (tableType.Equals("VIEW", StringComparison.OrdinalIgnoreCase))
                        {
                            TableComboBox.Items.Add("[VIEW] " + tableName);
                        }
                        else
                        {
                            TableComboBox.Items.Add(tableName);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba tortent a tablakat es nezeteket betoltesekor: " + ex.Message);
            }
        }

        // Segedmetodus az objektum nevenek tisztitasara ("[VIEW] " eltag eltavolitasara)
        private string GetRealTableName(string tableName)
        {
            if (tableName.StartsWith("[VIEW] "))
                return tableName.Substring(7);
            return tableName;
        }

        // Ellenorzi, hogy a kivalasztott objektum view-e
        private bool IsView(string tableName)
        {
            return tableName.StartsWith("[VIEW] ");
        }

        // Tabla vagy nezet adatinak betoltese a DataGrid-be
        private void TableComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (TableComboBox.SelectedItem == null) return;

            string selectedItem = TableComboBox.SelectedItem.ToString();
            isCurrentView = IsView(selectedItem);
            string selectedTable = GetRealTableName(selectedItem);

            // Ha view-t toltunk be, akkor a DataGrid legyen csak olvashato
            CarDataGrid.IsReadOnly = isCurrentView;

            if (IsValidTable(selectedTable))
            {
                LoadTableData(selectedTable);
            }
            else
            {
                MessageBox.Show("A kivalasztott tabla vagy nezet nem letezik vagy hibas!");
            }
        }

        // Validacios metodus
        private bool IsValidTable(string tableName)
        {
            string[] validTables = { "autok", "dolgozo", "eladok", "hasznalat", "jogosultsag",
                                     "markak", "modellek", "motorspecifikaciok", "motortipusok",
                                     "parkolo", "regisztracio", "sebessegvaltok", "szinek" };
            if (Array.Exists(validTables, table => table == tableName))
                return true;
            return true;
        }

        private void LoadTableData(string selectedTable)
        {
            try
            {
                using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                {
                    conn.Open();
                    string query = string.Empty;

                    // Ha az autok tablazatot toltjuk be, join-okkal lekerjuk az ertelmezheto adatokat.
                    if (selectedTable.Equals("autok", StringComparison.OrdinalIgnoreCase))
                    {
                        query = @"
                    SELECT
                      a.Auto_ID AS Auto_ID,
                      a.Rendszam AS Rendszam,
                      m.Marka AS Marka,
                      sz.Szin AS Szin,
                      mo.Modell AS Modell,
                      a.Evjarat AS Evjarat,
                      a.Kilometerora AS Kilometerora,
                      mt.Motortipus AS Motortipus,
                      ms.Motorspecifikacio AS Motorspecifikacio,
                      h.Hasznalat AS Hasznalat,
                      sv.Sebessegvalto AS Sebessegvalto,
                      a.Ar AS Ar,
                      e.Nev AS Nev,
                      e.Telefon AS Telefon,
                      e.Email AS Email
                    FROM autok a
                    JOIN markak m ON a.Marka_ID = m.Marka_ID
                    JOIN szinek sz ON a.Szin_ID = sz.Szin_ID
                    JOIN modellek mo ON a.Modell_ID = mo.Modell_ID
                    JOIN motortipusok mt ON a.Motortipus_ID = mt.Motortipus_ID
                    JOIN motorspecifikaciok ms ON a.Motorspecifikacio_ID = ms.Motorspecifikacio_ID
                    JOIN hasznalat h ON a.Hasznalat_ID = h.Hasznalat_ID
                    JOIN sebessegvaltok sv ON a.Sebessegvalto_ID = sv.Sebessegvalto_ID
                    JOIN eladok e ON a.Elado_ID = e.Elado_ID
                    ORDER BY a.Auto_ID;";
                    }
                    else
                    {
                        query = $"SELECT * FROM {selectedTable};";
                    }

                    adapter = new MySqlDataAdapter(query, conn);

                    // Csak akkor generalunk modosito parancsokat, ha nem az "autok" tablazatrol van szo 
                    // (vagy ha nem view-t toltunk be)
                    if (!selectedTable.Equals("autok", StringComparison.OrdinalIgnoreCase) && !isCurrentView)
                    {
                        MySqlCommandBuilder builder = new MySqlCommandBuilder(adapter);
                        adapter.InsertCommand = builder.GetInsertCommand();
                        adapter.UpdateCommand = builder.GetUpdateCommand();
                        adapter.DeleteCommand = builder.GetDeleteCommand();
                    }

                    table = new DataTable();
                    adapter.Fill(table);
                    CarDataGrid.ItemsSource = table.DefaultView;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba tortent az adatok betoltesekor: " + ex.Message);
            }
        }

        // Adatok mentese az adatbazisba
        private void SaveChanges_Click(object sender, RoutedEventArgs e)
        {
            if (isCurrentView)
            {
                MessageBox.Show("A view modositasa nem targyalt, ezert a valtozasok nem menthetok.");
                return;
            }

            try
            {
                if (table != null)
                {
                    int rowsUpdated = adapter.Update(table);
                    MessageBox.Show($"{rowsUpdated} sor sikeresen mentve!");
                }
                else
                {
                    MessageBox.Show("Nincs betoltott adat a menteshez.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba tortent a mentes soran: " + ex.Message);
            }
        }

        // Adat hozzaadasa
        private void AddButton_Click(object sender, RoutedEventArgs e)
        {
            if (isCurrentView)
            {
                MessageBox.Show("A view-ba valo adat hozzaadasa nem targyalt.");
                return;
            }

            if (TableComboBox.SelectedItem == null) return;
            string selectedTable = GetRealTableName(TableComboBox.SelectedItem.ToString());

            using (MySqlConnection conn = new MySqlConnection(ConnectionString))
            {
                conn.Open();
                string query = $"SHOW COLUMNS FROM `{selectedTable}`";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                AddDataWindow addDataWindow = new AddDataWindow(selectedTable, reader);
                addDataWindow.ShowDialog();
            }
        }

        // Adat modositasa a TextBox-bol
        private void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            if (isCurrentView)
            {
                MessageBox.Show("A view modositasa nem targyalt.");
                return;
            }

            try
            {
                if (CarDataGrid.SelectedIndex >= 0)
                {
                    DataRowView selectedRow = (DataRowView)CarDataGrid.SelectedItem;
                    string selectedTable = GetRealTableName(TableComboBox.SelectedItem.ToString());

                    using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                    {
                        conn.Open();
                        string query = $"SHOW COLUMNS FROM `{selectedTable}`";
                        MySqlCommand cmd = new MySqlCommand(query, conn);
                        MySqlDataReader reader = cmd.ExecuteReader();

                        EditWindow editWindow = new EditWindow(selectedTable, reader, selectedRow);
                        editWindow.ShowDialog();

                        if (editWindow.DialogResult == true)
                        {
                            LoadTableData(selectedTable);
                        }
                    }
                }
                else
                {
                    MessageBox.Show("Valasszon ki egy sort a modositashez.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba tortent az adat modositasakor: " + ex.Message);
            }
        }

        // Adat torlese
        private void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            if (isCurrentView)
            {
                MessageBox.Show("A view torlese nem targyalt.");
                return;
            }

            try
            {
                if (CarDataGrid.SelectedIndex >= 0)
                {
                    DataRowView selectedRow = (DataRowView)CarDataGrid.SelectedItem;
                    string selectedTable = GetRealTableName(TableComboBox.SelectedItem.ToString());

                    string selectedId = selectedRow.Row[0].ToString();
                    if (string.IsNullOrEmpty(selectedId))
                    {
                        MessageBox.Show("A kivalasztott sor nem tartalmaz ervenyes azonositot.");
                        return;
                    }

                    string query = $"DELETE FROM `{selectedTable}` WHERE `{selectedRow.Row.Table.Columns[0].ColumnName}` = @id";

                    using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                    {
                        MySqlCommand cmd = new MySqlCommand(query, conn);
                        cmd.Parameters.AddWithValue("@id", selectedId);

                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            MessageBox.Show("A rekord sikeresen torolve!");
                            selectedRow.Row.Delete();
                        }
                        else
                        {
                            MessageBox.Show("A torles sikertelen! Ellenorizze az adatbazist.");
                        }
                    }
                }
                else
                {
                    MessageBox.Show("Valasszon ki egy sort a torleshez.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba tortent a torles soran: " + ex.Message);
            }
        }

        // DataGrid sor valasztas esemenyenek kezelese a kocsik kephez
        private void CarDataGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (CarDataGrid.SelectedItem != null)
            {
                DataRowView row = CarDataGrid.SelectedItem as DataRowView;
                if (row != null)
                {
                    // Ellenorizzuk, hogy van-e "Auto_ID" oszlop, mert csak az "autok" tabla eseten van ilyen oszlop.
                    if (row.Row.Table.Columns.Contains("Auto_ID"))
                    {
                        currentCarId = Convert.ToInt32(row["Auto_ID"]);
                        currentImageIndex = 1;
                        LoadCarImage();
                    }
                    else
                    {
                        // Ha nem "autok" a tabla, akkor esetleg ne jelenjen meg kep,
                        // vagy más logikaval kezeld az esemenyt.
                        currentCarId = 0;
                        CarImage.Source = null;
                    }
                }
            }
        }



        // Kijelentkezes gomb esemeny kezelese
        private void LogoutButton_Click(object sender, RoutedEventArgs e)
        {
            MainWindow mainWindow = new MainWindow();
            mainWindow.Show();
            Application.Current.MainWindow = mainWindow;
            this.Close();
        }

        private void RefreshButton_Click(object sender, RoutedEventArgs e)
        {
            if (TableComboBox.SelectedItem != null)
            {
                string selectedTable = GetRealTableName(TableComboBox.SelectedItem.ToString());
                LoadTableData(selectedTable);

                CarDataGrid.Visibility = (CarDataGrid.Items.Count > 0) ? Visibility.Visible : Visibility.Collapsed;

                MessageBox.Show("Az adatok frissitve lettek!");
            }
            else
            {
                MessageBox.Show("Kerjuk, valasszon ki egy tablazatot vagy nezetet a frissiteshez.");
            }
        }

        // Filter gomb esemeny kezelese - szures az "autok" tabla alapjan
        private void FilterButton_Click(object sender, RoutedEventArgs e)
        {
            string selectedTable = GetRealTableName(TableComboBox.SelectedItem.ToString());
            if (selectedTable != "autok")
            {
                MessageBox.Show("Szures csak az 'autok' tablaban engedelyezett.");
                return;
            }

            string query = @"
                            SELECT 
                                autok.Auto_ID,
                                autok.Rendszam,
                                markak.Marka,
                                modellek.Modell,
                                autok.Evjarat,
                                szinek.Szin,
                                autok.Kilometerora,
                                motortipusok.Motortipus,
                                hasznalat.Hasznalat,
                                sebessegvaltok.Sebessegvalto,
                                autok.Ar
                            FROM autok
                            LEFT JOIN markak ON autok.Marka_ID = markak.Marka_ID
                            LEFT JOIN modellek ON autok.Modell_ID = modellek.Modell_ID
                            LEFT JOIN szinek ON autok.Szin_ID = szinek.Szin_ID
                            LEFT JOIN motortipusok ON autok.Motortipus_ID = motortipusok.Motortipus_ID
                            LEFT JOIN hasznalat ON autok.Hasznalat_ID = hasznalat.Hasznalat_ID
                            LEFT JOIN sebessegvaltok ON autok.Sebessegvalto_ID = sebessegvaltok.Sebessegvalto_ID
                            ";

            List<string> conditions = new List<string>();

            if (!string.IsNullOrWhiteSpace(rendszamTextBox.Text))
                conditions.Add("autok.Rendszam LIKE @rendszam");
            if (!string.IsNullOrWhiteSpace(markaTextBox.Text))
                conditions.Add("markak.Marka LIKE @marka");
            if (!string.IsNullOrWhiteSpace(modellTextBox.Text))
                conditions.Add("modellek.Modell LIKE @modell");
            if (!string.IsNullOrWhiteSpace(evjaratTextBox.Text))
                conditions.Add("autok.Evjarat LIKE @evjarat");
            if (!string.IsNullOrWhiteSpace(szinTextBox.Text))
                conditions.Add("szinek.Szin LIKE @szin");
            if (!string.IsNullOrWhiteSpace(kmoraTextBox.Text))
                conditions.Add("autok.Kilometerora LIKE @kmora");
            if (!string.IsNullOrWhiteSpace(motortipusTextBox.Text))
                conditions.Add("motortipusok.Motortipus LIKE @motortipus");
            if (!string.IsNullOrWhiteSpace(hasznalatTextBox.Text))
                conditions.Add("hasznalat.Hasznalat LIKE @hasznalat");
            if (!string.IsNullOrWhiteSpace(sebvaltoTextBox.Text))
                conditions.Add("sebessegvaltok.Sebessegvalto LIKE @sebvalto");
            if (!string.IsNullOrWhiteSpace(arTextBox.Text))
                conditions.Add("autok.Ar LIKE @ar");

            if (conditions.Count > 0)
            {
                query += " WHERE " + string.Join(" AND ", conditions);
            }

            try
            {
                using (MySqlConnection conn = new MySqlConnection(ConnectionString))
                {
                    conn.Open();
                    MySqlDataAdapter filterAdapter = new MySqlDataAdapter(query, conn);

                    if (!string.IsNullOrWhiteSpace(rendszamTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@rendszam", "%" + rendszamTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(markaTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@marka", "%" + markaTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(modellTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@modell", "%" + modellTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(evjaratTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@evjarat", "%" + evjaratTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(szinTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@szin", "%" + szinTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(kmoraTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@kmora", "%" + kmoraTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(motortipusTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@motortipus", "%" + motortipusTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(hasznalatTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@hasznalat", "%" + hasznalatTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(sebvaltoTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@sebvalto", "%" + sebvaltoTextBox.Text + "%");
                    if (!string.IsNullOrWhiteSpace(arTextBox.Text))
                        filterAdapter.SelectCommand.Parameters.AddWithValue("@ar", "%" + arTextBox.Text + "%");

                    DataTable filterTable = new DataTable();
                    filterAdapter.Fill(filterTable);
                    CarDataGrid.ItemsSource = filterTable.DefaultView;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba tortent a szures soran: " + ex.Message);
            }
        }

        private void rendszamTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            // Szovegvaltozas kezelese
        }

        // Segedmetodus a kocsi kepenek betoltesere a currentCarId es currentImageIndex alapjan
        private void LoadCarImage()
        {
            if (currentCarId == 0)
            {
                CarImage.Source = null;
                return;
            }

            string imagePath = Path.Combine(ImageFolder, $"{currentCarId}.{currentImageIndex}.jpg");
            if (File.Exists(imagePath))
            {
                BitmapImage bitmap = new BitmapImage(new Uri(imagePath, UriKind.Absolute));
                CarImage.Source = bitmap;
            }
            else
            {
                CarImage.Source = null;
            }
        }

        // Előző kép gomb eseménykezelője
        private void NextImage_Click(object sender, RoutedEventArgs e)
        {
            if (currentCarId == 0)
            {
                MessageBox.Show("Nincs kocsi kiválasztva.");
                return;
            }

            // Növeljük az indexet, és ellenőrizzük, hogy a következő kép létezik-e
            currentImageIndex++;
            string imagePath = Path.Combine(ImageFolder, $"{currentCarId}.{currentImageIndex}.jpg");
            if (!File.Exists(imagePath))
            {
                // Ha nem található, visszatérünk az első képhez
                currentImageIndex = 1;
            }
            LoadCarImage();
        }

        private void PreviousImage_Click(object sender, RoutedEventArgs e)
        {
            if (currentCarId == 0)
            {
                MessageBox.Show("Nincs kocsi kiválasztva.");
                return;
            }

            // Ha az aktuális index már az 1, akkor semmi változtatás, vagy visszaállítjuk 1-re
            if (currentImageIndex <= 1)
            {
                currentImageIndex = 1;
            }
            else
            {
                // Csökkentjük az indexet, majd ellenőrizzük, hogy a kép létezik-e
                currentImageIndex--;
                string imagePath = Path.Combine(ImageFolder, $"{currentCarId}.{currentImageIndex}.jpg");
                if (!File.Exists(imagePath))
                {
                    // Ha nem található, visszatérünk az első képhez
                    currentImageIndex = 1;
                }
            }
            LoadCarImage();
        }

    }
}
