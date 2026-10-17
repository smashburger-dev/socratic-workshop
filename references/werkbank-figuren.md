# Werkbankfiguren für Socratic Workshop

Lies diese Referenz, wenn eine interaktive Figur einen Zusammenhang leichter untersuchbar macht. Die Figur bearbeitet genau eine offene Verständnisfrage aus dem Gespräch. Eine kurze Textskizze reicht, wenn Bewegung oder veränderbare Eingaben keinen Erkenntnisgewinn bringen.

## Herkunft und Anpassung

Adaptiert aus [Werkbankfiguren im Argmin-Repository, Stand 51cbc90](https://github.com/smashburger-dev/argmin/blob/51cbc90/.devin/skills/werkbank-figuren/SKILL.md). Übernommen sind ein sichtbarer Mechanismus, modellabhängige Darstellung, Vorhersage vor Auflösung, benannte Analogiegrenzen und die Tonwertpalette. Dieser Adapter funktioniert eigenständig. Er benötigt weder Argmin noch eine andere Skill-Installation.

Das Ergebnis ist eine lokale HTML-Datei mit eingebettetem SVG, CSS und JavaScript. Verwende Systemschriften. Die Datei funktioniert ohne CDN, Netzwerk, Paketinstallation oder Build. Die Argmin-Renderer, Szenendateien und Testvorgaben gehören nicht zu diesem Ablauf. Erstelle und starte keine automatisierten Tests für diese Lernfiguren.

## 1. Erkenntnis und Freigabe festlegen

Übernimm Lernziel, bereits gezeigte Informationen und aktuelle Hinweisstufe aus dem Gespräch. Formuliere vor dem Bau einen Satz: „Durch Ändern von X kann die lernende Person erkennen, wie Y entsteht.“ Wähle eine kontrollierbare Ursache und eine sichtbare Wirkung. Wenn dieser Satz keine konkrete Beziehung nennt, kläre die Beziehung zuerst im Gespräch.

Der Hauptskill bestimmt, wie viel die Figur verraten darf:

| Modus | Inhalt der Datei | Ende der Interaktion |
|---|---|---|
| Hinweis | Nur die bereits freigegebene Hinweisstufe; eine Beobachtung oder ein kleiner Eingriff | Eine offene Frage und Rückkehr ins Gespräch |
| Vollständige Erklärung | Der ausdrücklich angeforderte Erklärungsumfang mit nachvollziehbarer Herleitung | Vorhersage, Auflösung, eigener Erklärversuch |

Eine Hinweisdatei enthält keine spätere Auflösung. Lasse Lösungswerte, nächste Rechenschritte, vollständige Erklärtexte und lösungsverratende Zustände vollständig aus HTML, SVG, JavaScript, Daten, Kommentaren und zugänglichen Namen weg. CSS-Verstecken, deaktivierte Knöpfe oder eine clientseitige Freischaltung sind dafür keine Schranke. Auch Schieberegler und berechnete Werte dürfen die erlaubte Hinweisstufe nicht umgehen. Beschränke ihren Wertebereich oder zeige ein passendes Teilproblem.

Eine Vorhersage oder ein Klick erteilt keine neue Freigabe für eine höhere Hinweisstufe. Wenn die Person später mehr Hilfe anfordert, ergänze oder ersetze die Datei um genau die nun erlaubten Inhalte. Ein Hinweis endet ohne eingebauten Lösungsbutton.

## 2. Einen Mechanismus bauen

Wähle die Darstellung nach der Beziehung. Nutze flache 2D-Flächen, wenn räumliche Tiefe nichts erklärt. Verwende eine räumliche Analogie nur, wenn deren räumliche Eigenschaften zum Verständnis beitragen.

| Gegenstand | Möglicher Mechanismus | Sichtbare Grenze |
|---|---|---|
| Mathematik | Koeffizient verändern; Vektor und Rechnung ändern sich gemeinsam | Eine geometrische Deutung gilt nur für den benannten Zahlenraum und die gewählte Operation |
| Naturwissenschaft | Eine Eingangsgröße verändern; eine Modellvorhersage verfolgen | Annahmen, Einheiten und Gültigkeitsbereich des Modells benennen |
| Sprache | Ein Satzglied umstellen; Bezüge oder Bedeutungsunterschiede verfolgen | Varianten und Kontextabhängigkeit benennen; die Darstellung beweist keine allgemeine Sprachregel |
| Prozess oder Business | Ankunftsrate oder Bearbeitungszeit verändern; Warteschlange verfolgen | Vereinfachende Annahmen über Auslastung und Variation offenlegen; Beispieldaten als solche markieren |

Diese Beispiele sind Auswahlhilfen. Baue nur den Mechanismus, der zur konkreten Frage passt. Jedes sichtbare Teil trägt eine Bedeutung oder eine bedienbare Funktion. Eine Werkbank, ein Förderband oder eine Maschine ist keine Pflichtkulisse.

Halte fachliche Eingaben und abgeleitete Größen in einem kleinen `model`. Berechne quantitative Positionen, Längen, Flächen, Zahlen und Beschriftungen daraus. Die angezeigte Rechnung und die Grafik verwenden dieselben Werte. Layoutabstände dürfen feste Konstanten sein; fachliche Größen erhalten keine unabhängig eingetippten Duplikate. Bei sprachlichen oder qualitativen Beispielen verwendet das Modell explizite, nachvollziehbare Fälle statt vorgetäuschter Messwerte.

Ordne die Schritte so, dass eine Veränderung mit ihrer Wirkung verglichen werden kann. Halte Ausgangs- und Folgezustand bei Bedarf nebeneinander sichtbar. Bewahre Achsenskalierung, Objektidentität und Zuordnung zwischen den Schritten. Jede Einheit, Achse und relevante Größe hat eine lesbare Beschriftung.

Wenn eine Analogie verwendet wird, ergänze „Wo der Vergleich hinkt“ mit mindestens einer konkreten Grenze. Zeige danach die erlaubte fachliche Entsprechung in derselben Notation oder Begrifflichkeit wie die Lernaufgabe. Im Hinweismodus bleibt auch diese Entsprechung innerhalb der freigegebenen Stufe.

## 3. Vorhersage und Erklärung führen

Beginne mit einer kurzen Beobachtung und einer gezielten Frage zur nächsten Veränderung. Gib der Person Gelegenheit zu einer eigenen Vorhersage. Speichere deren Eingabe nur im Arbeitsspeicher der Seite.

In einer vollständigen Erklärung folgt auf „Vorhersage festhalten“ oder „Überspringen“ ein eigener, bewusst ausgelöster Auflösungsschritt. Zeige das Ergebnis und den Mechanismus, der es erzeugt. Die Vorhersage bleibt daneben lesbar. Offene Freitextantworten werden nicht mit einem starren Zeichenkettenvergleich als richtig oder falsch bewertet. Lass die Person ihre Erklärung mit der sichtbaren Wirkung vergleichen und einen Unterschied benennen.

In einer Hinweisdatei folgt stattdessen nur die erlaubte Beobachtung. Sie kann die Vorhersage prüfbar machen, solange dabei keine höhere Hilfestufe erscheint. Schließe mit einer Frage, die das Weiterdenken im Gespräch ermöglicht.

Beende eine vollständige Erklärung mit einem kurzen Transfer: Was würde sich bei einer veränderten Bedingung ändern, und weshalb? Die Figur unterstützt den eigenen Erklärversuch. Sie ersetzt ihn nicht durch einen langen Mustertext.

## 4. Ruhig und bedienbar gestalten

Verwende diese Palette als Ausgangspunkt. Wähle eine passende Papierfarbe für den Hintergrund und prüfe die tatsächliche Lesbarkeit von Text und Bedienelementen im gewählten Kontext.

| Rolle | Hell | Dunkel |
|---|---|---|
| Sockel, Rahmen | `#bdb3a5` | `#3a343f` |
| Struktur | `#d8d0c4` | `#4a4450` |
| Gegenstand | `#ece6dc` | `#615a68` |
| Aktueller Akzent | `#6d3fd4` | `#b79cff` |
| Kanten | `#5c5650` | `#a89f94` |

Setze pro Schritt einen Akzent für das gerade Wesentliche. Farbe erhält eine zweite Kennzeichnung durch Form, Position oder Text. Falls Farbe selbst Daten kodiert, verwende eine beschriftete sequenzielle Skala oder wenige klar unterscheidbare Klassen mit zusätzlichen Symbolen.

Bewege nur etwas, dessen Änderung eine Bedeutung hat. Jede kurze Bewegung endet in einem stabilen, lesbaren Zustand. Kein Autoplay. `prefers-reduced-motion: reduce` zeigt denselben Endzustand unmittelbar. Halte Erklärung und Bedienelemente auch ohne Bewegung verständlich.

Verwende native Buttons und Eingabefelder mit sichtbaren Beschriftungen, erkennbarem Tastaturfokus und mindestens 44 px hohen Klickflächen. „Zurück“, „Weiter“ und „Von vorn“ reichen meist aus. Zeige „Schritt k von n“ als Text. Fange Tastenkürzel nur ab, wenn sie keine Texteingabe stören. Eine räumliche Ansicht braucht bedienbare Alternativen zum Ziehen; eine 2D-Figur braucht keine Kamerasteuerung.

Halte Beschriftungen bei normaler Ansicht mindestens 14 px groß. Verhindere Überlappungen, auch auf schmalen Bildschirmen und bei vergrößerter Schrift. Ergänze beim SVG einen zugänglichen Titel und eine kurze Beschreibung. Ein textlicher Ablauf vermittelt dieselbe freigegebene Erkenntnis. Rein visuelle Positions- oder Farbänderungen brauchen eine verständliche textliche Entsprechung.

## 5. Manuell prüfen und zurückgeben

Öffne die Datei im Browser, wenn Browserzugriff verfügbar ist. Gehe die erlaubten Schritte selbst durch, ändere einen fachlichen Eingangswert und vergleiche Grafik, Beschriftung und Rechnung. Probiere Tastaturbedienung, schmale Ansicht und reduzierte Bewegung. Lies bei einer Hinweisdatei außerdem den Quelltext auf Inhalte höherer Hinweisstufen durch. Diese Prüfung erfolgt ohne Testskripte oder Testframeworks.

Korrigiere sichtbare Überschneidungen, unlesbare Zustände und fachliche Widersprüche vor der Übergabe. Wenn keine Browseransicht verfügbar ist, benenne die fehlende Sichtprüfung knapp. Gib den absoluten Dateipfad und eine Zeile zur untersuchbaren Beziehung zurück. Setze im Gespräch mit der einen offenen Lernfrage fort, die zur aktuellen Stufe gehört.
