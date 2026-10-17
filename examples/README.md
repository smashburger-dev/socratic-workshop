# Drei Entwürfe für den Socratic Workshop

Diese Dateien sind Demo-Entwürfe und warten auf Noas Review. Sie sind keine Aufzeichnungen echter Lernsitzungen, keine bestätigten Nutzerpräferenzen und kein Nachweis für Lernerfolg. Sie zeigen, wie sich ausgewählte Werkbankfiguren-Prinzipien auf drei Themen übertragen lassen. Ob diese Übertragung beim Lernen hilft, muss eine echte Sitzung erst zeigen.

Öffne eine HTML-Datei direkt im Browser. Jede Datei enthält ihr CSS und JavaScript und braucht weder Installation noch Server, CDN oder Framework. Die drei Dateien können unabhängig kopiert werden; nur die freiwilligen Links am Seitenende verweisen aufeinander.

| Datei | Mechanismus und Eingriff | Sichtbare Grenze |
| --- | --- | --- |
| [gradient-descent.html](gradient-descent.html) | Startpunkt und positive Lernrate wählen, Abstand nach einem Schritt vorhersagen, Rechnung aufdecken, bis zu zwölf Schritte verfolgen. | Exakte eindimensionale Parabel, konstante Lernrate, kein Rauschen. Für diese Funktion konvergiert 0 < η < 1; η = 1 pendelt außer beim Start im Minimum. |
| [german-word-order.html](german-word-order.html) | Hauptsatz oder weil-Nebensatz wählen, finite Verbposition vorhersagen, Satz aufdecken. Ein Mehrwort-Satzglied erklärt Position 2. | Einfaches Präsensverb in der Standardsprache. Keine Fragen, Verbkomplexe oder Umgangssprache. |
| [bottleneck.html](bottleneck.html) | Drei Stationskapazitäten ändern, maximalen Durchsatz vorhersagen, Minimum aufdecken und mit der vorigen Rechnung vergleichen. Gleichstände sind möglich. | Deterministischer eingeschwungener Zustand, ausreichende Puffer, Nachfrage und Material. Keine Durchlaufzeiten oder Warteschlangen. |

Alle Entwürfe verwenden warmes Papier, gedämpfte Tonstufen, einen violetten semantischen Akzent, mindestens 14 px Text, native Tastaturbedienung, sichtbare Fokusrahmen, eine Textbeschreibung, Zurücksetzen und Druckstile. Die Modelle animieren nicht automatisch. Eine neue Eingabe verdeckt die Lösung und fordert eine neue Vorhersage.

## Was als Nächstes noch fehlt

Noas Review und mindestens eine echte Lernsitzung. Reale Sitzungsbelege müssten die eigene Vorhersage, die Erklärung nach dem Aufdecken, einen selbst erklärten Transfer und offene Missverständnisse festhalten. Nur mit ausdrücklicher Zustimmung sollten solche Belege gespeichert werden. Diese Entwürfe enthalten keine erfundenen Lernendenantworten, Freigaben oder Messwerte.

Stand der Prüfung: manuelle Quelltextprüfung. Browserdarstellung, Tastaturabläufe und Druckausgabe wurden nicht praktisch geprüft. Die Review-Umgebung ließ das Öffnen lokaler HTML-Dateien im Browser nicht zu. Es wurden keine Tests oder Testinfrastruktur erstellt oder ausgeführt.
