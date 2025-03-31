[Setup]
AppName=AutoKereskedes
AppVersion=1.0
DefaultDirName={pf}\AutoKereskedes
DefaultGroupName=AutoKereskedes
OutputDir=./Output
OutputBaseFilename=AutoKereskedes
Compression=lzma
SolidCompression=yes

[Files]
Source: "C:\Users\13d\Desktop\Projekt\Asztali App\adminpanel\bin\Debug\net8.0-windows\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs
Source: "C:\Users\13d\Desktop\Projekt\Asztali App\adminpanel\bin\Debug\net8.0-windows\Img\*"; DestDir: "{app}\Img"; Flags: recursesubdirs createallsubdirs

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Setup]
; Engedélyezze a telepítési mappa kiválasztását
DisableDirPage=no
AllowNoIcons=yes

[Icons]
Name: "{group}\adminpanel"; Filename: "{app}\adminpanel.exe"
Name: "{commondesktop}\adminpanel"; Filename: "{app}\adminpanel.exe"

[Run]
Filename: "{app}\\adminpanel.exe"; Description: "Indítás a telepítés után"; Flags: nowait postinstall shellexec
