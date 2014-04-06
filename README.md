[![Build Status](https://travis-ci.org/panc/TipExpert.png?branch=master)](https://travis-ci.org/panc/TipExpert) [![Dependency Status](https://gemnasium.com/panc/TipExpert.png)](https://gemnasium.com/panc/TipExpert)

<img src="http://tipexpert.net/files/tipexpert/img/tipexpert_v4_2.png" width="300"/>

---

Tipexpert ist das Tippspiel der nächsten Generation. Individuell anpassbar, persönlich und sozial. Messe spielerisch dein sportliches Gefühl mit Freunden, Bekannten und Kollegen.

## Wie funktionierts?

TBD

## Demo

Eine erste Demo-Version kann unter http://tipexpert.herokuapp.com/ getestet werden.

Einfach mit einem Facebook- oder Google-Konto anmelden oder einen neuen User registrieren.
Angemeldete User verfügen derzeit noch über alle Rechte, also nicht wundern ;-)


# Features

## Backend (Administration)

**Erledigt**

* User-Verwaltung
 * Social Login
 * Normaler Login über User-Registrierung
 * Rollen (bisher nur User oder Admin) vergeben

* Ligen verwalten 
 * Liga hinzufügen/editieren/löschen

* Spielpaarungen verwalten
 * Paarungen hinzufügen/editieren


**TBD**

* Manschaften verwalten 
 * hinzufügen/editieren/löschen
 * automatisch anlegen wenn beim Erfassen einer Spielpaarung eine unbekannte Mannschaft eingegeben wird

* Spielpaarungen verwalten
 * Paarungen löschen
 * Paarungen nach Datum gruppiert anzeigen
 * Ergebnis erfassen
 * Spielpaarungen und Ergebnisse über WebService abrufen (http://www.openligadb.de/)


## Frontend (User)

**Erledigt**

* Tipp-Spiele verwalten
 * Spiele anlegen / bearbeiten
 * Mindest-Spiel-Einsatz festlegen
 * Spielpaarungen auswählen
 * Freunde hinzufügen (z.Z. werden einfach alle User angezeigt)
 * 2 Ansichten: Aus Sicht des Erstellers (Edit) | Aus Sicht des eingelandenen Teilnehmers (Show)
 

**TBD**

* Tipp-Spiel anlegen
 * Freunde einladen (z.B. per E-Mail)

* Tipps in einem Tipp-Spiel abgeben

* Punkte auswerten, wenn alle Begenungen in einem Tipp-Spiel abgeschossen wurden

* Eigenes Profil veralten

* Freunde verwalten

* Freunde von Google oder Facebook importieren?
