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
  - [ ] Post może zawierać:
    - [ ] **DST** tekst,
    - [ ] **DST** link,
    - [ ] **DST** wideo (z Youtube),
    - [ ] **DST** obrazek (na serwerze),
    - [ ] ankietę (uwaga na próby wielokrotnego głosowania - Uniemożliwić je)
  - [ ] system komentarzy (socket.io)
    - [ ] **DST** dynamiczny
    - [ ] ***BDB*** hierarchiczny
  - [ ] Wymagane podstrony
    - [ ] **DST** (przynajmniej jeden) Home użytkownika z opcjami sortowania
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
| PUT    | `/api/u/r/:reddit`                 |         | Subskrybcja            |
| DELETE | `/api/u/r/:reddit`                 |         | Anulowanie subskrybcji |
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
| `get`               |            | Zapytanie o pełne dane postu     |

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
| `get`               | post       | Pełne dane postu                 |
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
type uuid    = string
type url     = string
type Null<T> = T | null
type vote    = -1 | 0 | +1 // Downvote, brak głosu lub upvote

interface User {
  id:       uuid
  admin:    boolean
  username: string
  password: Null<string> // Hasło jest null gdy pobieramy innych użytkowników
  email:    Null<string> // Podobnie jak wyżej
  created:  Date
}

interface Reddit {
  id:      uuid
  name:    string
  text:    string
  mods:    User[]
  posts:   number
  users:   number
  created: Date
}

// Interfejs WebSocket
interface Post {
  id:       uuid
  name:     string
  text:     string
  image:    Null<url> // URL do zasobu na serwerze
  video:    Null<url> // URL youtube
  survey:   Null<Survey>
  comments: Comment[]
  voted:    vote
  score:    number
  created:  Date
}

interface Survey {
  options: Option[]
  answer:  Null<number> // Opcja zaznaczona przez obecnego użytkownika
}

interface Option {
  id:    number
  text:  string
  score: number
}

interface Comment {
  id:      uuid
  user:    User
  text:    string
  parent:  Null<uuid> // Komentarz do innego komentarza lub do postu
  voted:   vote
  score:   number
  created: Date
}
```
