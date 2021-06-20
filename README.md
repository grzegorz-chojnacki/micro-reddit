# Projekt egzaminacyjny - MicroReddit

## Interfejs
- Zarówno "przeglądarkowy" jak i (responsywny) "mobilny" (oparty o Vue.js 3 i SCSS)

## Funkcjonalność
- [x] Użytkownicy
  - [x] **DST** Rejestracja
    > (prosty formularz - login w postaci adresu e-mail, hasło, powtórzone hasło + walidacja danych - login musi być unikatowy i poprawny "składniowo" jako adres e-mail, a hasła identyczne)
  - [x] **DST** Modyfikacja profilu użytkownika
    > (zmiana hasła)
  - [x] **DST** Obsługa logowania (zwykłe)
    > (w oparciu o zapamiętane w lokalnej bazie dane użytkownika)
  - [ ] Podział ról:
    - [x] **DST** Moderatorzy - zarządzają subredditami `/r/temat`:
      - [x] Edycja metadanych
        > (opis - obsługa edycji za pomocą pola tekstowego)
      - [x] Usuwanie postów/komentarzy
    - [ ] Administratorzy
      - [ ] Usuwanie/banowanie "niegrzecznych" użytkowników
      - [ ] ***BDB*** Wgląd do statystyk (największe subreddity - hierarchia, hierachia polubień postów/suredditów)
  - [ ] ***BDB*** Aktywacja konta po kliknięciu na "ograniczony czasowo link aktywacyjny"
  - [ ] Przypominanie hasła
  - [x] **DST** Dołączanie do konkretnych subredditów
- [ ] Subreddity (`/r/nazwaSubreddita`)
  - [x] **DST** Tworzenie subredditów
    > (twórca automatycznie zostaje moderatorem)
  - [x] Opcje wyświetlania postów w ramach subreddita
    > (np. karty/lista/...)
  - [x] **DST** Tworzenie postów w ramach danego (sub)reddita
  - [x] **DST** Możliwość przechodzenia pomiędzy subredditami
  - [x] **DST** Głosowanie na posty
    > (głos za/przeciw - można oddać tylko jeden)
  - [x] **DST** Post może zawierać: tekst, link, wideo (z Youtube), obrazek (na serwerze)
  - [x] **DST** Dynamiczny (***BDB*** i hierarchiczny) system komentarzy (socket.io)
    > (aktywni użytkownicy widzą komentarze w momencie ich dodania; komentarze/posty po usunięciu przez moderatora znikają)
- [ ] Wymagane podstrony
  - [x] **DST** Home użytkownika
     - [x] Opcje sortowania (Best, Hot - Tempo przyrostu polubień, New)

## Pozostałe funkcjonalności
- [x] **DST** Wyszukiwarka (postów według treści/subredditów według nazwy)
  > (pole/pola tekstowe z ewentualnym "przełącznikiem" treść/nazwa)
- [ ] ***BDB*** Powiadomienia o odpowiedziach lub zmianach w trendach dotyczący postów danego użytkownika (socket.io)
- [x] **DST** Wybór popularnych (według liczby postów i liczby użytkowników) subredditów
  > (Top-Five najlepszych względem wybranego kryterium)

## Strona serwerowa
- Struktura będzie zadana, wstępne dane do załadowania będą zapewnione
- Serwer REST i jego API do zrobienia
- socket.io

## Interfejs i zależności
- Vue.js 3 + Vue-router (!!!)
- Bootstrap + SCSS lub Vuetify lub ewentualnie inna bibiloteka do "współpracy" Vue-Bootstrap (koniecznie należy użyć SCSS!)
- axios.js
- pg
- passport.js
- socket.io (do wszelkich zastosowań "komunikacyjnych" wykorzystujących Websockets)
- Wybrana biblioteka do obsługi poczty elektronicznej

<hr>

## Wersja **DST**
- [x] Użytkownicy
  - [x] Rejestracja
  - [x] Modyfikacja profilu użytkownika
  - [x] Obsługa logowania (zwykłe)
  - [x] Edycja metadanych subreddita przez moderatora
  - [x] Usuwanie postów przez moderatora
  - [x] Usuwanie komentarzy przez moderatora
  - [x] Dołączanie do konkretnych subredditów
- [x] Subreddity (`/r/nazwaSubreddita`)
  - [x] Tworzenie subredditów
  - [x] Tworzenie postów w ramach danego (sub)reddita
  - [x] Możliwość przechodzenia pomiędzy subredditami
  - [x] Głosowanie na posty
  - [x] Post może zawierać: tekst, link, wideo (z Youtube), obrazek (na serwerze)
  - [x] Dynamiczny system komentarzy (socket.io)
- [x] Home użytkownika
- [x] Wyszukiwarka (postów według treści/subredditów według nazwy)
- [x] Wybór popularnych (według liczby postów i liczby użytkowników) subredditów

## Wersja **DB**
- [ ] Administratorzy
  - [ ] Usuwanie/banowanie "niegrzecznych" użytkowników
- [ ] Przypominanie hasła
- [x] Opcje wyświetlania postów w ramach subreddita (karty/lista)
- [x] Opcjami sortowania home użytkownika (Best, Hot - Tempo przyrostu polubień, New)

# Reddit API
## Frontend
### Ścieżki
| Publiczne                | Opis                                 |
| ------------------------ | ------------------------------------ |
| `/`                      | Widok główny z najnowszymi postami   |
| `/r?q=query`             | Widok listy redditów z wyszukiwaniem |
| `/r/:redditName?q=query` | Widok reddita z listą postów         |
| `/r/:redditName/p/:post` | Widok postu z komentarzami           |

| Użytkownik     | Opis                   |
| -------------- | ---------------------- |
| `/home?s=sort` | Home z sortowaniem     |
| `/account`     | Ustawienia użytkownika |


### Widoki
- [Toolbar](*) (Wspólny komponent paska narzędziowego)
  - Odnośnik do strony głównej
  - Dialog rejestracji
  - Dialog logowania
  - Dialog tworzenia reddita
  - Odnośnik do widoku ustawień użytkownika
  - Wyszukiwarka redditów

- [MainView::public](/)
  - Pasek narzędziowy
    - Pole wyszukiwania postów  (z przełącznikiem tytuł/treść)
    - Sortowanie
  - Lista postów ze wszystkich redditów

- [MainView::home](/home)
  - Pasek narzędziowy
    - Pole wyszukiwania postów
    - Sortowanie
  - Lista postów z zasubskrybowanych redditów użytkownika

- [AccountView](/account)
  - Ustawienia użytkownika
    - Dialog zmiany dla każdej opcji

- [RedditView](/r/:redditName)
  - Pasek narzędziowy reddita
    - Pole wyszukiwania postów (z przełącznikiem tytuł/treść)
    - Przycisk na dodanie postu
      - Dialog dodawania postu
    - Sortowanie
  - Boczny panel akcji dla użytkownika
    - Metadane reddita
      - Dialog zmiany metadanych dla moderatorów
    - Przycisk subskrybowania/odsubskrybowania
  - Lista postów

- [PostView](/r/:redditName/p/:postId)
  - Post
    - Treść postu
    - Głosowanie
    - Usunięcie postu (moderator, administrator)
  - Lista komentarzy
    - Dialog odpowiadania na komentarz
    - Usunięcie komentarza (moderator, administrator)
    - Usunięcie użytkownika (administrator)

## Backend
| Metoda | Publiczny                             | Payload | Opis               |
| ------ | ------------------------------------- | ------- | ------------------ |
| GET    | `/`                                   |         | Frontend           |
| POST   | `/api/u`                              | user    | Rejestracja        |
| POST   | `/api/login`                          | creds   | Logowanie          |
| POST   | `/api/logout`                         |         | Wylogowanie        |
| POST   | `/api/u/password`                     | email   | Zresetowanie hasła |
| GET    | `/api/r?q=query&p=page`               |         | Paczka redditów    |
| GET    | `/api/r/:redditName`                  |         | Metadane reddita   |
| GET    | `/api/r/:redditName/p?q=query&p=page` |         | Paczka postów      |
| WS     | `/api/r/:redditName/p/:postId`        |         | Pokój postu        |

| Metoda | Użytkownik                          | Payload | Opis               |
| ------ | ----------------------------------- | ------- | ------------------ |
| GET    | `/api/u`                            |         | Dane konta         |
| GET    | `/api/u/home?q=query&p=page`        |         | Paczka redditów    |
| PATCH  | `/api/u`                            | user    | Modyfikacja konta  |
| DELETE | `/api/u`                            |         | Usunięcie konta    |
| PATCH  | `/api/u/r/:redditName`              | state   | Zmiana subskrybcji |
| POST   | `/api/r`                            | reddit  | Dodanie reddita    |
| POST   | `/api/r/:redditName/p`              | post    | Dodanie postu      |
| PATCH  | `/api/r/:redditName/p/:postId/vote` | -1/0/-1 | Głosowanie na post |

| Metoda | Moderator                        | Payload | Opis               |
| ------ | -------------------------------- | ------- | ------------------ |
| PUT    | `/api/r/:redditName`             | reddit  | Edycja metadanych  |
| POST   | `/api/r/:redditName/m/:username` |         | Dodanie moderatora |
| DELETE | `/api/r/:redditName/p/:postId`   |         | Usunięcie postu    |

| Metoda | Administrator    | Payload | Opis                   |
| ------ | ---------------- | ------- | ---------------------- |
| DELETE | `/api/u/:userId` |         | Zbanowanie użytkownika |


### WebSocket API
| Publiczne  | Payload | Opis                             |
| ---------- | ------- | -------------------------------- |
| `comments` |         | Komentarze                       |
| `wipe`     | user-id | Usunięcie komentarzy użytkownika |
| `redirect` |         | Powrót do tyłu w historii        |

| Użytkownik | Payload | Opis               |
| ---------- | ------- | ------------------ |
| `comment`  | comment | Dodanie komentarza |

| Moderator       | Payload    | Opis                 |
| --------------- | ---------- | -------------------- |
| `deleteComment` | comment-id | Usunięcie komentarza |
| `deletePost`    | post-id    | Usunięcie postu      |

| Serwer          | Payload    | Opis                             |
| --------------- | ---------- | -------------------------------- |
| `comment`       | comment    | Dodanie komentarza do listy      |
| `deletePost`    | post-id    | Usunięcie postu                  |
| `deleteComment` | comment-id | Usunięcie komentarza użytkownika |

### Usuwanie użytkownika
- Dla danego użytkownika
  - Wylogowanie go
  - Usunięcie konta
  - Usunięcie postów
    - Wysłanie wiadomości `redirect` do każdego pokoju z postem użytkownika
  - Usunięcie komentarzy
    - Wysłanie wiadomości `wipe` do każdego pokoju z komentarzem użytkownika

## Domena
```ts
type role    = 'user' | 'mod' | 'admin'
type url     = string
type Null<T> = T | null
type vote    = -1 | 0 | +1 // Downvote, brak głosu lub upvote przez użytkownika

interface User {
  id:       number
  username: string
  password: Null<string> // Hasło nie jest null tylko po stronie backendu
  email:    string
  admin:    boolean
  modding:  Reddit[]
}

// Jako autor postu, bazy danych lub moderator na liście moderatorów
interface OtherUser {
  id:       number
  username: string
  admin:    boolean
}

interface Reddit {
  id:          number
  name:        string
  description: string
  mods:        User[]
  subscribed:  boolean
}

// Występuje na liście redditów
interface SimpleReddit {
  id:         number
  name:       string
  subscribed: boolean
}

// Występuje w Post
interface MinimalReddit {
  id:   number
  name: string
}

interface Post {
  id:       number
  reddit:   MinimalReddit
  title:    string
  content:  string
  image:    Null<url> // URL do zasobu na serwerze
  video:    Null<url> // URL youtube
  comments: Comment[]
  voted:    vote
  score:    number
  created:  Date
}

interface Comment {
  id:      number
  user:    User
  content: string
}
```
