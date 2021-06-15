# Projekt egzaminacyjny - MicroReddit

## Interfejs
- Zarówno "przeglądarkowy" jak i (responsywny) "mobilny" (oparty o Vue.js 3 i SCSS)

## Funkcjonalność
- [ ] Użytkownicy
  - [ ] **DST** Rejestracja
    > (prosty formularz - login w postaci adresu e-mail, hasło, powtórzone hasło + walidacja danych - login musi być unikatowy i poprawny "składniowo" jako adres e-mail, a hasła identyczne)
  - [ ] **DST** Modyfikacja profilu użytkownika
    > (zmiana hasła)
  - [x] **DST** Obsługa logowania (zwykłe)
    > (w oparciu o zapamiętane w lokalnej bazie dane użytkownika)
  - [ ] Podział ról:
    - [x] **DST** Moderatorzy - zarządzają subredditami `/r/temat`:
      - [x] Edycja metadanych
        > (opis - obsługa edycji za pomocą pola tekstowego)
      - [ ] Usuwanie postów/komentarzy
    - [ ] Administratorzy
      - [ ] Usuwanie/banowanie "niegrzecznych" użytkowników
      - [ ] ***BDB*** Wgląd do statystyk (największe subreddity - hierarchia, hierachia polubień postów/suredditów)
  - [ ] ***BDB*** Aktywacja konta po kliknięciu na "ograniczony czasowo link aktywacyjny"
  - [ ] Przypominanie hasła
  - [x] **DST** Dołączanie do konkretnych subredditów
- [ ] Subreddity (`/r/nazwaSubreddita`)
  - [x] **DST** Tworzenie subredditów
    > (twórca automatycznie zostaje moderatorem)
  - [ ] Opcje wyświetlania postów w ramach subreddita
    > (np. karty/lista/...)
  - [x] **DST** Tworzenie postów w ramach danego (sub)reddita
  - [x] **DST** Możliwość przechodzenia pomiędzy subredditami
  - [ ] **DST** Głosowanie na posty
    > (głos za/przeciw - można oddać tylko jeden)
  - [ ] **DST** Post może zawierać: tekst, link, wideo (z Youtube), obrazek (na serwerze)
  - [ ] **DST** Dynamiczny (***BDB*** i hierarchiczny) system komentarzy (socket.io)
    > (aktywni użytkownicy widzą komentarze w momencie ich dodania; komentarze/posty po usunięciu przez moderatora znikają)
- [ ] Wymagane podstrony
  - [x] **DST** Home użytkownika
     - [ ] Opcje sortowania (Best, Hot - Tempo przyrostu polubień, New)

## Pozostałe funkcjonalności
- [ ] **DST** Wyszukiwarka (postów według treści/subredditów według nazwy)
  > (pole/pola tekstowe z ewentualnym "przełącznikiem" treść/nazwa)
- [ ] ***BDB*** Powiadomienia o odpowiedziach lub zmianach w trendach dotyczący postów danego użytkownika (socket.io)
- [ ] **DST** Wybór popularnych (według liczby postów i liczby użytkowników) subredditów
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
- [ ] Użytkownicy
  - [ ] Rejestracja
  - [ ] Modyfikacja profilu użytkownika
  - [x] Obsługa logowania (zwykłe)
  - [x] Edycja metadanych subreddita przez moderatora
  - [x] Dołączanie do konkretnych subredditów
- [ ] Subreddity (`/r/nazwaSubreddita`)
  - [x] Tworzenie subredditów
  - [x] Tworzenie postów w ramach danego (sub)reddita
  - [x] Możliwość przechodzenia pomiędzy subredditami
  - [ ] Głosowanie na posty
  - [ ] Post może zawierać: tekst, link, wideo (z Youtube), obrazek (na serwerze)
  - [ ] Dynamiczny system komentarzy (socket.io)
- [x] Home użytkownika
- [ ] Wyszukiwarka (postów według treści/subredditów według nazwy)
- [ ] Wybór popularnych (według liczby postów i liczby użytkowników) subredditów

## Wersja **DB**
- [ ] Administratorzy
  - [ ] Usuwanie/banowanie "niegrzecznych" użytkowników
- [ ] Przypominanie hasła
- [ ] Opcje wyświetlania postów w ramach subreddita
- [ ] Opcjami sortowania home użytkownika (Best, Hot - Tempo przyrostu polubień, New)

## Wersja **BDB**
- [ ] Administratorzy
  - [ ] Wgląd do statystyk (największe subreddity - hierarchia, hierachia polubień postów/suredditów)
- [ ] Aktywacja konta po kliknięciu na "ograniczony czasowo link aktywacyjny"
- [ ] Dynamiczny i hierarchiczny system komentarzy (socket.io)
- [ ] Powiadomienia o odpowiedziach lub zmianach w trendach dotyczący postów danego użytkownika (socket.io)

# Reddit API
## Frontend
### Ścieżki
| Publiczne          # | Opis                         # |
| -------------------- | ------------------------------ |
| `/`                  | Widok listy redditów           |
| `/r?q=query`         | Wynik wyszukiwania redditów    |
| `/r/:reddit`         | Widok reddita z listą postów   |
| `/r/:reddit?q=query` | Wynik wyszukiwania postów      |
| `/r/:reddit/p/:post` | Widok postu z komentarzami     |

| Użytkownik         # | Opis                         # |
| -------------------- | ------------------------------ |
| `/home`              | Home użytkownika               |
| `/home?s=sort`       | Home z sortowaniem             |
| `/account`           | Ustawienia użytkownika         |

| Administrator      # | Opis                         # |
| -------------------- | ------------------------------ |
| `/stats`             | Podgląd statystyk redditów (?) |


### Widoki
- [Toolbar](*) (Wspólny komponent paska narzędziowego)
  - Odnośnik do strony głównej
  - Wyszukiwarka redditów
  - Dialog logowania
  - Dialog rejestracji
  - Odnośnik do widoku ustawień użytkownika

- [MainView::public](/)
  - Lista postów ze wszystkich redditów
  - Panel akcji dla administratora

- [MainView::home](/home)
  - Lista postów z zasubskrybowanych redditów użytkownika
  - Panel akcji dla administratora

- [AccountView](/account)
  - Ustawienia użytkownika

- [RedditView](/r/:redditId)
  - Lista postów
  - Pole wyszukiwania postów
  - Boczny panel akcji dla użytkownika
    - Metadane reddita
    - Subskrybowanie/odsubskrybowanie
    - Dodanie postu
  - Boczny panel akcji dla administratora
    - Usunięcie reddita

- [PostView](/r/:reddit/p/:postId)
  - Post
    - Treść postu
    - Głosowanie
    - Usunięcie postu (moderator, administrator)
  - Lista komentarzy
    - Dialog odpowiadania na komentarz
    - Głosowanie
    - Usunięcie komentarza (moderator, administrator)
    - Zbanowanie użytkownika (moderator)
    - Usunięcie użytkownika (administrator)

## Backend
| Metoda | Publiczny                        # | Payload | Opis                 # |
| ------ | ---------------------------------- | ------- | ---------------------- |
| GET    | `/`                                |         | Frontend               |
| GET    | `/api/r?q=query&p=page`            |         | Paczka redditów        |
| GET    | `/api/r/:reddit`                   |         | Metadane reddita       |
| GET    | `/api/r/:reddit/p?q=query&p=page`  |         | Paczka postów          |
| GET    | `/api/u`                           |         | Dane konta             |
| POST   | `/api/u`                           | user    | Rejestracja            |
| WS     | `/api/r/:reddit/p/:post`           |         | Pokój postu            |

| Metoda | Użytkownik                       # | Payload | Opis                 # |
| ------ | ---------------------------------- | ------- | ---------------------- |
| GET    | `/api/u/:user/home?q=query&p=page` |         | Paczka redditów        |
| PUT    | `/api/u/:user`                     | user    | Modyfikacja konta      |
| DELETE | `/api/u/:user`                     |         | Usunięcie konta        |
| POST   | `/api/u/:user/password`            | email   | Reset hasła (na email) |
| POST   | `/api/u/:user/activate?t=token`    |         | Aktywacja (z emaila)   |
| PATCH  | `/api/u/r/:reddit`                 | State   | Stan subskrybcji       |
| POST   | `/api/r`                           | reddit  | Dodanie reddita        |
| POST   | `/api/r/:reddit/p`                 | post    | Dodanie postu          |
| PATCH  | `/api/r/:reddit/p/:post/vote`      | -1/0/-1 | Głosowanie na post     |

| Metoda | Moderator                        # | Payload | Opis                 # |
| ------ | ---------------------------------- | ------- | ---------------------- |
| PUT    | `/api/r/:reddit`                   | reddit  | Edycja metadanych      |
| DELETE | `/api/r/:reddit/p/:post`           |         | Usunięcie postu        |

| Metoda | Administrator                    # | Payload | Opis                 # |
| ------ | ---------------------------------- | ------- | ---------------------- |
| GET    | `/api/stats`                       |         | Statystyki (?)         |


### WebSocket API
| Publiczne         # | Payload  # | Opis                           # |
| ------------------- | ---------- | -------------------------------- |
| `comments`          |            | Komentarze                       |

| Użytkownik        # | Payload  # | Opis                           # |
| ------------------- | ---------- | -------------------------------- |
| `comment`           | comment    | Dodanie komentarza               |
| `upvote`/`downvote` | comment-id | Głosowanie na komentarz          |
| `survey`            | option-id  | Odpowiedź w ankiecie             |

| Moderator         # | Payload  # | Opis                           # |
| ------------------- | ---------- | -------------------------------- |
| `delete`            | comment-id | Usunięcie komentarza             |
| `delete`            | post-id    | Usunięcie postu                  |

| Administrator     # | Payload  # | Opis                           # |
| ------------------- | ---------- | -------------------------------- |
| `ban`               | user-id    | Zbanowanie użytkownika           |

| Serwer            # | Payload  # | Opis                           # |
| ------------------- | ---------- | -------------------------------- |
| `comment`           | comment    | Dodanie komentarza do listy      |
| `upvote`/`downvote` | comment-id | Zmiana liczby głosów komentarza  |
| `survey`            | survey     | Wynik ankiety                    |
| `delete`            | post-id    | Usunięcie postu                  |
| `delete`            | comment-id | Usunięcie komentarza użytkownika |
| `ban`               | user-id    | Wyczyszczenie użytkownika[^wipe] |

[^wipe]:
- Dla danego użytkownika
  - Wylogowanie go
  - Usunięcie konta
  - Usunięcie komentarzy
  - Usunięcie postów
- Dla pozostałych
  - Jeżeli post był zbanowanego użytkownika - **(1)**, inaczej - **(2)**
    1. Przekierowanie użytkowników na reddit
    2. Usunięcie komentarzy zbanowanego użytkownika

## Domena
```ts
type role    = 'user' | 'mod' | 'admin'
type url     = string
type Null<T> = T | null
type vote    = -1 | 0 | +1 // Downvote, brak głosu lub upvote przez użytkownika

interface User {
  id:       number
  admin:    boolean
  username: string
  password: Null<string> // Hasło nie jest null tylko po stronie backendu
  email:    Null<string> // Podobnie jak wyżej
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
