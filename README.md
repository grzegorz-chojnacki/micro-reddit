# Projekt egzaminacyjny – MicroReddit

## Interfejs
- Zarówno „przeglądarkowy” jak i (responsywny) „mobilny” (oparty o Vue.js 3 i SCSS)

### Funkcjonalność
- [ ] Użytkownicy
  - [ ] **DST** Rejestracja
  - [ ] **DST** Obsługa logowania (zwykłe)
  - [ ] Podział ról:
    - [ ] **DST** Moderatorzy – zarządzają subredditami `/r/temat`:
      - [ ] Edycja metadanych
      - [ ] Usuwanie postów/komentarzy
    - [ ] Administratorzy
      - [ ] Usuwanie/banowanie „niegrzecznych” użytkowników
      - [ ] ***BDB*** Wgląd do statystyk (największe subreddity - hierarchia,
            hierachia polubień postów/suredditów)
  - [ ] ***BDB*** Aktywacja konta po kliknięciu na „ograniczony czasowo link aktywacyjny”
  - [ ] Przypominanie/modyfikacja hasła
  - [ ] **DST** Dołączanie do konkretnych subredditów
  - [ ] **DST** Modyfikacja profilu użytkownika (zmiana adresu e-mail, zmiana hasła)
- [ ] Subreddity (`/r/nazwaSubreddita`)
  - [ ] **DST** Tworzenie subredditów (twórca automatycznie zostaje moderatorem,
        kolejnych moderatorów może dodać moderator)
  - [ ] Opcje wyświetlania postów w ramach subreddita (np. karty/lista/…)
  - [ ] **DST** Tworzenie postów w ramach danego (sub)reddita
  - [ ] **DST** Możliwość przechodzenia pomiędzy subredditami
  - [ ] **DST** Głosowanie na posty
  - [ ] Post może zawierać: tekst, link, wideo (z Youtube), obrazek (na serwerze),
        ankietę (uwaga na próby wielokrotnego głosowania - Uniemożliwić je)
  - [ ] **DST** dynamiczny (i hierarchiczny ***BDB***) system komentarzy (socket.io)
  - [ ] Wymagane podstrony
    - [ ] **DST** (przynajmniej jedend) Home użytkownika z opcjami sortowanie
          (Best, Hot - Tempo przyrostu polubień, New)

### Pozostałe funkcjonalności
- [ ] **DST** Wyszukiwarka (postów wg treści/subredditów wg nazwy)
- [ ] ***BDB*** Powiadomienia o odpowiedziach lub zmianach w trendach dotyczący
      postów danego użytkownika (socket.io)
- [ ] **DST** Wybór popularnych (według liczby postów i liczby uzytkowsników) subredditów

## Strona serwerowa
- [ ] Struktura będzie zadana, wstępne dane do załadowania będą zapewnione
- [ ] Serwer REST i jego API do zrobienia
- [ ] socket.io

## Interfejs i zależności
- Vue.js 3 + Vue-router (!!!)
- Bootstrap + SCSS lub Vuetify lub ewentualnie inna bibiloteka do „współpracy”
  Vue-Bootstrap (koniecznie należy użyć SCSS!)
- axios.js
- pg
- passport.js
- socket.io (do wszelkich zastosowań „komunikacyjnych” wykorzystujących Websockets)
- Wybrana biblioteka do obsługi poczty elektronicznej
